package models

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"travel_mate/backend/database"
)

type Group struct {
	Id           int     `json:"id"`
	AdminId      int     `json:"adminId"`
	Name         string  `json:"name"`
	Description  string  `json:"description"`
	MembersCount *int    `json:"membersCount,omitempty"`
	LastActivity *string `json:"lastActivity,omitempty"`
	UnreadCount  *int    `json:"unreadCount,omitempty"`
}

// CreateGroup - with detailed logging
func CreateGroup(creatorID int, name, description string) (int, error) {
	log.Printf("[CreateGroup] Starting transaction - creatorID=%d, name=%q, desc=%q", creatorID, name, description)

	tx, err := database.DB.Begin()
	if err != nil {
		log.Printf("[CreateGroup] Failed to begin transaction: %v", err)
		return 0, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() {
		if err != nil {
			log.Printf("[CreateGroup] Rolling back transaction due to error: %v", err)
			_ = tx.Rollback()
		}
	}()

	const qInsertGroup = `
		INSERT INTO groups (name, description, admin_id)
		VALUES ($1, $2, $3)
		RETURNING id`

	log.Printf("[CreateGroup] Executing INSERT INTO groups...")
	var gid int
	if err = tx.QueryRow(qInsertGroup, name, description, creatorID).Scan(&gid); err != nil {
		log.Printf("[CreateGroup] Failed to insert group: %v", err)
		log.Printf("[CreateGroup] Query: %s", qInsertGroup)
		log.Printf("[CreateGroup] Params: name=%q, desc=%q, admin_id=%d", name, description, creatorID)
		return 0, fmt.Errorf("failed to insert group: %w", err)
	}
	log.Printf("[CreateGroup] Group inserted successfully with id=%d", gid)

	const qInsertAdmin = `
		INSERT INTO group_members (group_id, user_id, role, joined_at)
		VALUES ($1, $2, 'admin', now())`

	log.Printf("[CreateGroup] Adding creator as admin member...")
	if _, err = tx.Exec(qInsertAdmin, gid, creatorID); err != nil {
		log.Printf("[CreateGroup] Failed to insert admin member: %v", err)
		log.Printf("[CreateGroup] Query: %s", qInsertAdmin)
		log.Printf("[CreateGroup] Params: group_id=%d, user_id=%d", gid, creatorID)
		return 0, fmt.Errorf("failed to add admin member: %w", err)
	}
	log.Printf("[CreateGroup] Admin member added successfully")

	// Create group conversation within the transaction
	log.Printf("[CreateGroup] Creating group conversation for group %d", gid)
	groupNamePtr := &name
	var convID int
	
	// Check if conversation already exists (shouldn't, but handle it)
	const findConvQ = `SELECT id FROM conversations WHERE type='group' AND group_id=$1 LIMIT 1`
	err = tx.QueryRow(findConvQ, gid).Scan(&convID)
	if err == nil {
		log.Printf("[CreateGroup] Group conversation already exists with id=%d", convID)
	} else if errors.Is(err, sql.ErrNoRows) {
		// Create new conversation
		err = tx.QueryRow(`
			INSERT INTO conversations (type, title, group_id, created_at)
			VALUES ('group', $1, $2, NOW())
			RETURNING id
		`, groupNamePtr, gid).Scan(&convID)
		if err != nil {
			log.Printf("[CreateGroup] Failed to create group conversation: %v", err)
			return 0, fmt.Errorf("failed to create group conversation: %w", err)
		}
		log.Printf("[CreateGroup] Group conversation created with id=%d", convID)
	} else {
		log.Printf("[CreateGroup] Error checking for existing conversation: %v", err)
		return 0, fmt.Errorf("failed to check for existing conversation: %w", err)
	}

	// Add admin to conversation (use same transaction)
	log.Printf("[CreateGroup] Adding admin to group conversation...")
	res, err := tx.Exec(`
		INSERT INTO conversation_members (conversation_id, user_id, role, joined_at)
		VALUES ($1, $2, 'member', NOW())
		ON CONFLICT (conversation_id, user_id) DO NOTHING
	`, convID, creatorID)
	if err != nil {
		log.Printf("[CreateGroup] Failed to add admin to conversation: %v", err)
		return 0, fmt.Errorf("failed to add admin to group conversation: %w", err)
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected > 0 {
		log.Printf("[CreateGroup] Admin added to group conversation successfully")
	} else {
		log.Printf("[CreateGroup] Admin already in group conversation")
	}

	if err = tx.Commit(); err != nil {
		log.Printf("[CreateGroup] Failed to commit transaction: %v", err)
		return 0, fmt.Errorf("failed to commit transaction: %w", err)
	}

	log.Printf("[CreateGroup] SUCCESS - Group %d created by user %d", gid, creatorID)
	return gid, nil
}

// For GroupsHomeScreen list (shows counts)
func GetGroupsByUser(userID int) ([]Group, error) {
	const q = `
	  SELECT g.id, g.name, g.description,
	         COALESCE(mc.cnt,0) AS members_count,
	         to_char(g.created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS last_activity
	  FROM groups g
	  JOIN group_members gm ON g.id = gm.group_id
	  LEFT JOIN (
	    SELECT group_id, COUNT(*)::int AS cnt
	    FROM group_members
	    GROUP BY group_id
	  ) mc ON mc.group_id = g.id
	  WHERE gm.user_id = $1
	  ORDER BY g.id DESC`
	rows, err := database.DB.Query(q, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []Group
	for rows.Next() {
		var g Group
		var cnt int
		var last string
		if err := rows.Scan(&g.Id, &g.Name, &g.Description, &cnt, &last); err == nil {
			g.MembersCount = &cnt
			g.LastActivity = &last
			z := 0
			g.UnreadCount = &z
			out = append(out, g)
		}
	}
	return out, nil
}

func GetGroupByID(id int) (Group, error) {
	const q = `
	  SELECT id, name, description,
	         NULL::int AS members_count,
	         to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS last_activity
	  FROM groups WHERE id=$1`
	var g Group
	var last *string
	if err := database.DB.QueryRow(q, id).Scan(&g.Id, &g.Name, &g.Description, new(sql.NullInt32), &last); err != nil {
		if err == sql.ErrNoRows {
			return g, errors.New("group not found")
		}
		return g, err
	}
	g.LastActivity = last
	return g, nil
}

func IsAdmin(groupID, userID int) (bool, error) {
	const q = `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2 AND role='admin' LIMIT 1`
	var one int
	err := database.DB.QueryRow(q, groupID, userID).Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return err == nil, err
}

func GetGroupIDByInvite(inviteID int) (int, error) {
	const q = `SELECT group_id FROM group_invites WHERE id=$1`
	var gid int
	err := database.DB.QueryRow(q, inviteID).Scan(&gid)
	return gid, err
}

type MyInviteRow struct {
	Id        int    `json:"id"`
	GroupID   int    `json:"group_id"`
	GroupName string `json:"group_name"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

func GetPendingInvitesForUser(userID int) ([]MyInviteRow, error) {
	const q = `
	  SELECT gi.id, gi.group_id, g.name,
	         gi.status,
	         to_char(gi.created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ')
	    FROM group_invites gi
	    JOIN groups g ON g.id = gi.group_id
	   WHERE gi.invitee_id = $1
	     AND gi.status = 'pending'
	   ORDER BY gi.id DESC`
	rows, err := database.DB.Query(q, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []MyInviteRow
	for rows.Next() {
		var r MyInviteRow
		if err := rows.Scan(&r.Id, &r.GroupID, &r.GroupName, &r.Status, &r.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	return out, rows.Err()
}

func IsInviteForUser(inviteID, userID int) (bool, error) {
	const q = `SELECT 1 FROM group_invites WHERE id=$1 AND invitee_id=$2 LIMIT 1`
	var one int
	err := database.DB.QueryRow(q, inviteID, userID).Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return err == nil, err
}

// UpdateGroupName updates the name of a group
func UpdateGroupName(groupID int, name string) error {
	const q = `UPDATE groups SET name = $1 WHERE id = $2`
	_, err := database.DB.Exec(q, name, groupID)
	if err != nil {
		log.Printf("[UpdateGroupName] Error updating group name: %v", err)
		return fmt.Errorf("failed to update group name: %w", err)
	}
	return nil
}

// DeleteGroup deletes a group and all related data (cascade)
func DeleteGroup(groupID int) error {
	// Delete group (CASCADE will handle related records)
	const q = `DELETE FROM groups WHERE id = $1`
	result, err := database.DB.Exec(q, groupID)
	if err != nil {
		log.Printf("[DeleteGroup] Error deleting group: %v", err)
		return fmt.Errorf("failed to delete group: %w", err)
	}
	
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to check rows affected: %w", err)
	}
	
	if rowsAffected == 0 {
		return errors.New("group not found")
	}
	
	return nil
}
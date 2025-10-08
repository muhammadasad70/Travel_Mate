package models

import (
	"database/sql"
	"errors"
	"travel_mate/backend/database"
)

type Group struct {
	Id           int     `json:"id"`
	AdminId      int     `json:"adminId"`
	Name         string  `json:"name"`
	Description  string  `json:"description"`
	MembersCount *int    `json:"membersCount,omitempty"`
	LastActivity *string `json:"lastActivity,omitempty"`
	UnreadCount  *int    `json:"unreadCount,omitempty"` // frontend safe; always null/0 for now
}

// func CreateGroup(creatorID int, name, description string) (int, error) {
// 	const q1 = `INSERT INTO groups (name, description) VALUES ($1,$2) RETURNING id`
// 	var gid int
// 	if err := database.DB.QueryRow(q1, name, description).Scan(&gid); err != nil {
// 		return 0, err
// 	}
// 	// add creator as admin
// 	const q2 = `INSERT INTO group_members (group_id, user_id, role) VALUES ($1,$2,'admin')`
// 	if _, err := database.DB.Exec(q2, gid, creatorID); err != nil {
// 		return 0, err
// 	}
// 	return gid, nil
// }

// ---- SCENARIO 1: Create group; creator becomes admin ----
func CreateGroup(creatorID int, name, description string) (int, error) {
	tx, err := database.DB.Begin()
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	// If your groups table has admin_id, prefer inserting it too.
	// CREATE TABLE groups(id serial PK, name text, description text, admin_id int, created_at timestamptz default now());
	const qInsertGroup = `
		INSERT INTO groups (name, description, admin_id)
		VALUES ($1,$2,$3)
		RETURNING id`
	var gid int
	if err = tx.QueryRow(qInsertGroup, name, description, creatorID).Scan(&gid); err != nil {
		return 0, err
	}

	// Add creator as admin member
	const qInsertAdmin = `
		INSERT INTO group_members (group_id, user_id, role, status, joined_at)
		VALUES ($1,$2,'admin','active', now())`
	if _, err = tx.Exec(qInsertAdmin, gid, creatorID); err != nil {
		return 0, err
	}

	if err = tx.Commit(); err != nil {
		return 0, err
	}
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
			g.UnreadCount = &z // no unread logic yet
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

// Optional helper if you later need admin checks
func IsAdmin(groupID, userID int) (bool, error) {
	const q = `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2 AND role='admin' LIMIT 1`
	var one int
	err := database.DB.QueryRow(q, groupID, userID).Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return err == nil, err
}

// Return the group_id for an invite (used to check admin on cancel/list)
func GetGroupIDByInvite(inviteID int) (int, error) {
	const q = `SELECT group_id FROM group_invites WHERE id=$1`
	var gid int
	err := database.DB.QueryRow(q, inviteID).Scan(&gid)
	return gid, err
}

// Used by GET /groups/invites (invitee inbox)
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

// Ensure the acting user owns the invite they’re accepting/declining
func IsInviteForUser(inviteID, userID int) (bool, error) {
	const q = `SELECT 1 FROM group_invites WHERE id=$1 AND invitee_id=$2 LIMIT 1`
	var one int
	err := database.DB.QueryRow(q, inviteID, userID).Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	return err == nil, err
}

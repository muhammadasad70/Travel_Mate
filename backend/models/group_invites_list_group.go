// models/group_invites_list_group.go
package models

import (
	"database/sql"
	"errors"
	"travel_mate/backend/database"
)

type GroupInviteRow struct {
	Id           int    `json:"id"`
	GroupID      int    `json:"group_id"`
	InviteeID    int    `json:"invitee_id"`
	InviteeEmail string `json:"invitee_email"`
	Status       string `json:"status"`
	CreatedAt    string `json:"created_at"`
}

func GetPendingInvitesForGroup(groupID int) ([]GroupInviteRow, error) {
	const q = `
	  SELECT gi.id, gi.group_id, gi.invitee_id, u.email, gi.status,
	         to_char(gi.created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ')
	    FROM group_invites gi
	    JOIN users u ON u.id = gi.invitee_id
	   WHERE gi.group_id = $1 AND gi.status = 'pending'
	   ORDER BY gi.id DESC`
	rows, err := database.DB.Query(q, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []GroupInviteRow
	for rows.Next() {
		var r GroupInviteRow
		if err := rows.Scan(&r.Id, &r.GroupID, &r.InviteeID, &r.InviteeEmail, &r.Status, &r.CreatedAt); err == nil {
			out = append(out, r)
		}
	}
	return out, nil
}

// ---- SCENARIO 2: Invite users (by userID or email) -> group_invites ----
// inviteeID is optional (pass nil if inviting by email only).
func InviteUserToGroup(groupID int, inviteeID *int, inviteeEmail *string) (int, error) {
	if (inviteeID == nil || *inviteeID == 0) && (inviteeEmail == nil || *inviteeEmail == "") {
		return 0, errors.New("either inviteeID or inviteeEmail required")
	}

	const q = `
		INSERT INTO group_invites (group_id, invitee_id, invitee_email, status, created_at)
		VALUES ($1,$2,$3,'pending', now())
		RETURNING id`
	var id int
	if err := database.DB.QueryRow(q, groupID, inviteeID, inviteeEmail).Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

// ---- SCENARIO 3 (updated): On invite status change -> if accepted, add to group_members
// Valid statuses: pending | accepted | declined | canceled
func UpdateInviteStatus(inviteID int, newStatus string) (bool, error) {
	// Return value indicates whether a new member was added (true if accepted and inserted)
	tx, err := database.DB.Begin()
	if err != nil {
		return false, err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	// Fetch invite (lock row)
	var groupID int
	var inviteeID sql.NullInt64
	var status string
	const qGet = `SELECT group_id, invitee_id, status FROM group_invites WHERE id=$1 FOR UPDATE`
	if err = tx.QueryRow(qGet, inviteID).Scan(&groupID, &inviteeID, &status); err != nil {
		return false, err
	}

	// If already terminal, do nothing
	if status == "accepted" || status == "declined" || status == "canceled" {
		_ = tx.Rollback()
		return false, nil
	}

	added := false

	// If user DECLINES, delete the invite row and exit
	if newStatus == "declined" {
		const qDel = `DELETE FROM group_invites WHERE id=$1`
		if _, err = tx.Exec(qDel, inviteID); err != nil {
			return false, err
		}
		if err = tx.Commit(); err != nil {
			return false, err
		}
		return false, nil
	}

	// Otherwise, update status (accepted/canceled/pending->something)
	const qUpd = `UPDATE group_invites SET status=$1 WHERE id=$2`
	if _, err = tx.Exec(qUpd, newStatus, inviteID); err != nil {
		return false, err
	}

	// If ACCEPTED and we know the user_id -> ensure membership
	if newStatus == "accepted" && inviteeID.Valid {
		uid := int(inviteeID.Int64)

		// Insert only if not already a member
		const qCheck = `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2`
		var dummy int
		checkErr := tx.QueryRow(qCheck, groupID, uid).Scan(&dummy)
		if errors.Is(checkErr, sql.ErrNoRows) {
			const qIns = `
				INSERT INTO group_members (group_id, user_id, role, status, joined_at)
				VALUES ($1,$2,'member','active', now())`
			if _, err = tx.Exec(qIns, groupID, uid); err != nil {
				return false, err
			}
			added = true
		} else if checkErr != nil {
			return false, checkErr
		}
	}

	if err = tx.Commit(); err != nil {
		return false, err
	}
	return added, nil
}

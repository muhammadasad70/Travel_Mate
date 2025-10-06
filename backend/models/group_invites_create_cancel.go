// models/group_invites_create_cancel.go
package models

import (
	"database/sql"
	"errors"
	"travel_mate/backend/database"
)

func CreateGroupInvite(groupID, inviterID, inviteeID int) error {
	// block if already a member
	const qMem = `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2 LIMIT 1`
	var one int
	if err := database.DB.QueryRow(qMem, groupID, inviteeID).Scan(&one); err == nil {
		return errors.New("user is already a member")
	} else if err != sql.ErrNoRows && err != nil {
		return err
	}

	// upsert pending invite
	const q = `INSERT INTO group_invites (group_id, inviter_id, invitee_id, status)
	           VALUES ($1,$2,$3,'pending')
	           ON CONFLICT (group_id, invitee_id) DO NOTHING`
	_, err := database.DB.Exec(q, groupID, inviterID, inviteeID)
	return err
}

func CancelGroupInvite(inviteID, actorID int) error {
	// actor must be inviter or group admin
	const q = `SELECT group_id, inviter_id, status FROM group_invites WHERE id=$1`
	var gid, inviter int
	var status string
	if err := database.DB.QueryRow(q, inviteID).Scan(&gid, &inviter, &status); err != nil {
		if err == sql.ErrNoRows {
			return errors.New("invite not found")
		}
		return err
	}
	if status != "pending" {
		return errors.New("cannot cancel non-pending invite")
	}
	ok, _ := IsAdmin(gid, actorID)
	if !ok && inviter != actorID {
		return errors.New("not allowed")
	}
	_, err := database.DB.Exec(`UPDATE group_invites SET status='cancelled' WHERE id=$1`, inviteID)
	return err
}

package models

import (
	"database/sql"
	"errors"
	"travel_mate/backend/database"
)

type GroupInvite struct {
	Id           int     `json:"id"`
	GroupID      int     `json:"group_id"`
	GroupName    string  `json:"groupName"`
	InviterID    int     `json:"inviter_id"`
	InviteeID    int     `json:"invitee_id"`
	Status       string  `json:"status"`
	LastActivity *string `json:"lastActivity,omitempty"`
}

// List invites directed to the logged-in user (pending only)
func ListPendingInvitesForUser(userID int) ([]GroupInvite, error) {
	const q = `
	  SELECT gi.id, gi.group_id, g.name, gi.inviter_id, gi.invitee_id, gi.status,
	         to_char(gi.created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ') AS last_activity
	  FROM group_invites gi
	  JOIN groups g ON g.id = gi.group_id
	  WHERE gi.invitee_id = $1 AND gi.status = 'pending'
	  ORDER BY gi.id DESC`
	rows, err := database.DB.Query(q, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []GroupInvite
	for rows.Next() {
		var inv GroupInvite
		var last string
		if err := rows.Scan(&inv.Id, &inv.GroupID, &inv.GroupName, &inv.InviterID, &inv.InviteeID, &inv.Status, &last); err == nil {
			inv.LastActivity = &last
			out = append(out, inv)
		}
	}
	return out, nil
}

func AcceptInvite(inviteID, userID int) (int, error) {
	// fetch invite
	const qFind = `SELECT group_id, invitee_id, status FROM group_invites WHERE id=$1 LIMIT 1`
	var gid, invitee int
	var status string
	if err := database.DB.QueryRow(qFind, inviteID).Scan(&gid, &invitee, &status); err != nil {
		if err == sql.ErrNoRows {
			return 0, errors.New("invite not found")
		}
		return 0, err
	}
	if invitee != userID {
		return 0, errors.New("not your invite")
	}
	if status != "pending" {
		return 0, errors.New("invite not pending")
	}

	// upsert membership
	const qMember = `INSERT INTO group_members (group_id, user_id, role)
	                 VALUES ($1,$2,'member')
	                 ON CONFLICT (group_id, user_id) DO NOTHING`
	if _, err := database.DB.Exec(qMember, gid, userID); err != nil {
		return 0, err
	}

	// mark accepted
	const qAcc = `UPDATE group_invites SET status='accepted' WHERE id=$1`
	if _, err := database.DB.Exec(qAcc, inviteID); err != nil {
		return 0, err
	}

	return gid, nil
}

func DeclineInvite(inviteID, userID int) error {
	const qFind = `SELECT invitee_id, status FROM group_invites WHERE id=$1 LIMIT 1`
	var invitee int
	var status string
	if err := database.DB.QueryRow(qFind, inviteID).Scan(&invitee, &status); err != nil {
		if err == sql.ErrNoRows {
			return errors.New("invite not found")
		}
		return err
	}
	if invitee != userID {
		return errors.New("not your invite")
	}
	if status != "pending" {
		return errors.New("invite not pending")
	}

	const qDec = `UPDATE group_invites SET status='declined' WHERE id=$1`
	_, err := database.DB.Exec(qDec, inviteID)
	return err
}

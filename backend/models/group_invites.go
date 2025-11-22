package models

import (
	"database/sql"
	"errors"
	"fmt"
	"travel_mate/backend/database"
)

// CreateGroupInvite creates an invite for a user to join a group
func CreateGroupInvite(groupID, inviterID, inviteeID int) error {
	// Check if invitee is already a member
	const checkMember = `SELECT 1 FROM group_members WHERE group_id=$1 AND user_id=$2 LIMIT 1`
	var exists int
	err := database.DB.QueryRow(checkMember, groupID, inviteeID).Scan(&exists)
	if err == nil {
		return errors.New("user is already a member of this group")
	}
	if err != sql.ErrNoRows {
		return fmt.Errorf("failed to check membership: %w", err)
	}

	// Check if there's already an invite (any status)
	const checkInvite = `SELECT id, status FROM group_invites WHERE group_id=$1 AND invitee_id=$2 LIMIT 1`
	var existingInviteID int
	var existingStatus string
	err = database.DB.QueryRow(checkInvite, groupID, inviteeID).Scan(&existingInviteID, &existingStatus)
	if err == nil {
		// Invite exists - if it's pending, return error; otherwise, update it to pending
		if existingStatus == "pending" {
			return errors.New("invite already exists for this user")
		}
		// If invite exists but is not pending (e.g., declined, canceled, accepted), update it to pending
		// Also update inviter_id in case it changed
		const updateInvite = `UPDATE group_invites SET status='pending', inviter_id=$1, created_at=NOW() WHERE id=$2`
		_, updateErr := database.DB.Exec(updateInvite, inviterID, existingInviteID)
		if updateErr != nil {
			return fmt.Errorf("failed to reactivate invite: %w", updateErr)
		}
		return nil // Successfully reactivated the invite
	}
	if err != sql.ErrNoRows {
		return fmt.Errorf("failed to check existing invite: %w", err)
	}

	// Get invitee's email (required by schema)
	const getEmail = `SELECT email FROM users WHERE id=$1`
	var email string
	err = database.DB.QueryRow(getEmail, inviteeID).Scan(&email)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("invitee user not found")
		}
		return fmt.Errorf("failed to get invitee email: %w", err)
	}

	// Create the invite with inviter_id and email (both required by NOT NULL constraints)
	const insertInvite = `
		INSERT INTO group_invites (group_id, inviter_id, invitee_id, invitee_email, status)
		VALUES ($1, $2, $3, $4, 'pending')`
	_, err = database.DB.Exec(insertInvite, groupID, inviterID, inviteeID, email)
	if err != nil {
		return fmt.Errorf("failed to create invite: %w", err)
	}

	return nil
}

// UpdateInviteStatus updates the status of an invite (accept/decline/cancel)
func UpdateInviteStatus(inviteID int, status string) (bool, error) {
	tx, err := database.DB.Begin()
	if err != nil {
		return false, err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	// Get invite details
	const getInvite = `SELECT group_id, invitee_id, status FROM group_invites WHERE id=$1`
	var groupID, inviteeID int
	var currentStatus string
	err = tx.QueryRow(getInvite, inviteID).Scan(&groupID, &inviteeID, &currentStatus)
	if err != nil {
		return false, err
	}

	if currentStatus != "pending" {
		return false, fmt.Errorf("invite is already %s", currentStatus)
	}

	// Update status
	const updateStatus = `UPDATE group_invites SET status=$1 WHERE id=$2`
	_, err = tx.Exec(updateStatus, status, inviteID)
	if err != nil {
		return false, err
	}

	memberAdded := false
	// If accepted, add user as member
	if status == "accepted" {
		const addMember = `
			INSERT INTO group_members (group_id, user_id, role, status, joined_at)
			VALUES ($1, $2, 'member', 'active', now())
			ON CONFLICT (group_id, user_id) DO NOTHING`
		result, err := tx.Exec(addMember, groupID, inviteeID)
		if err != nil {
			return false, err
		}
		rows, _ := result.RowsAffected()
		memberAdded = rows > 0
	}

	// Delete invite if declined or canceled
	if status == "declined" || status == "canceled" {
		const deleteInvite = `DELETE FROM group_invites WHERE id=$1`
		_, err = tx.Exec(deleteInvite, inviteID)
		if err != nil {
			return false, err
		}
	}

	if err = tx.Commit(); err != nil {
		return false, err
	}

	return memberAdded, nil
}

// GroupInviteRow represents an invite for a group (admin view)
type GroupInviteRow struct {
	Id          int    `json:"id"`
	GroupID     int    `json:"group_id"`
	InviteeID   int    `json:"invitee_id"`
	InviteeName string `json:"invitee_name"`
	InviteeEmail string `json:"invitee_email"`
	Status      string `json:"status"`
	CreatedAt   string `json:"created_at"`
}

// GetPendingInvitesForGroup returns all pending invites for a group with invitee details
func GetPendingInvitesForGroup(groupID int) ([]GroupInviteRow, error) {
	const q = `
		SELECT 
			gi.id, 
			gi.group_id, 
			gi.invitee_id,
			COALESCE(u.name, u.first_name || ' ' || u.last_name, '') as invitee_name,
			gi.invitee_email,
			gi.status,
			to_char(gi.created_at, 'YYYY-MM-DD"T"HH24:MI:SSZ')
		FROM group_invites gi
		LEFT JOIN users u ON u.id = gi.invitee_id
		WHERE gi.group_id = $1
		  AND gi.status = 'pending'
		ORDER BY gi.id DESC`
	rows, err := database.DB.Query(q, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []GroupInviteRow
	for rows.Next() {
		var r GroupInviteRow
		if err := rows.Scan(&r.Id, &r.GroupID, &r.InviteeID, &r.InviteeName, &r.InviteeEmail, &r.Status, &r.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	return out, rows.Err()
}

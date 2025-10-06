// models/group_invites_list_group.go
package models

import "travel_mate/backend/database"

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

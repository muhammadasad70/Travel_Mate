// models/group_members_list.go
package models

import "travel_mate/backend/database"

type GroupMemberRow struct {
	UserID    int    `json:"userId"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	JoinedAt  string `json:"joinedAt"`
}

func GetMembersByGroup(groupID int) ([]GroupMemberRow, error) {
	const q = `
	  SELECT u.id, COALESCE(u.first_name,''), COALESCE(u.last_name,''), u.email, gm.role,
	         to_char(gm.joined_at, 'YYYY-MM-DD"T"HH24:MI:SSZ')
	    FROM group_members gm
	    JOIN users u ON u.id = gm.user_id
	   WHERE gm.group_id=$1
	   ORDER BY (gm.role='admin') DESC, u.first_name, u.last_name, u.email`
	rows, err := database.DB.Query(q, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []GroupMemberRow{}
	for rows.Next() {
		var r GroupMemberRow
		if err := rows.Scan(&r.UserID, &r.FirstName, &r.LastName, &r.Email, &r.Role, &r.JoinedAt); err == nil {
			out = append(out, r)
		}
	}
	return out, nil
}

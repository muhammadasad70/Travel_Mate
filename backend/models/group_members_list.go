package models

import (
	"database/sql"
	"errors"
	"travel_mate/backend/database"
)

type GroupMemberRow struct {
	UserID    int    `json:"userId"`
	GroupId   int    `json:"groupId"`
	Role      string `json:"role"`
	Status    string `json:"status"`
	JoinedAt  string `json:"joinedAt"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

func GetMembersByGroup(groupID int) ([]GroupMemberRow, error) {
	const q = `
	  SELECT
	    gm.user_id,
	    gm.group_id,
	    gm.role,
	    COALESCE(gm.status, 'active') AS status,
	    to_char(gm.joined_at, 'YYYY-MM-DD"T"HH24:MI:SSZ'),
	    COALESCE(u.first_name, '') AS first_name,
	    COALESCE(u.last_name, '') AS last_name,
	    COALESCE(u.email, '') AS email
	  FROM group_members gm
	  LEFT JOIN users u ON u.id = gm.user_id
	  WHERE gm.group_id = $1
	  ORDER BY (gm.role = 'admin') DESC, u.first_name, u.last_name, u.email`

	rows, err := database.DB.Query(q, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []GroupMemberRow{}
	for rows.Next() {
		var r GroupMemberRow
		if err := rows.Scan(&r.UserID, &r.GroupId, &r.Role, &r.Status, &r.JoinedAt, &r.FirstName, &r.LastName, &r.Email); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	return out, rows.Err()
}

func RemoveUserFromGroup(groupID, userID int) error {
	const q = `DELETE FROM group_members WHERE group_id=$1 AND user_id=$2`
	_, err := database.DB.Exec(q, groupID, userID)
	return err
}

func IsUserInGroup(groupID, userID int) (bool, string, string, error) {
	const q = `
	  SELECT role, COALESCE(status, 'active')
	  FROM group_members
	  WHERE group_id = $1 AND user_id = $2
	  LIMIT 1`
	var role, status string
	err := database.DB.QueryRow(q, groupID, userID).Scan(&role, &status)
	if errors.Is(err, sql.ErrNoRows) {
		return false, "", "", nil
	}
	if err != nil {
		return false, "", "", err
	}
	return true, role, status, nil
}

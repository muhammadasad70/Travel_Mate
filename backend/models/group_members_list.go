// models/group_members_list.go
package models

import (
	"database/sql"
	"errors"
	"travel_mate/backend/database"
)

type GroupMemberRow struct {
	UserID   int    `json:"userId"`
	GroupId  int    `json:"groupId"`
	Role     string `json:"role"`
	Status   string `json:"status"`
	JoinedAt string `json:"joinedAt"`
}

// ---- SCENARIO 4: Remove a user from the group ----
// Soft-remove via status, or hard delete (choose one). Below: hard delete.
func RemoveUserFromGroup(groupID, userID int) error {
	const q = `DELETE FROM group_members WHERE group_id=$1 AND user_id=$2`
	_, err := database.DB.Exec(q, groupID, userID)
	return err
}

// func GetMembersByGroup(groupID int) ([]GroupMemberRow, error) {
// 	const q = `
// 	  SELECT u.id, COALESCE(u.first_name,''), COALESCE(u.last_name,''), u.email, gm.role,
// 	         to_char(gm.joined_at, 'YYYY-MM-DD"T"HH24:MI:SSZ')
// 	    FROM group_members gm
// 	    JOIN users u ON u.id = gm.user_id
// 	   WHERE gm.group_id=$1
// 	   ORDER BY (gm.role='admin') DESC, u.first_name, u.last_name, u.email`
// 	rows, err := database.DB.Query(q, groupID)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	out := []GroupMemberRow{}
// 	for rows.Next() {
// 		var r GroupMemberRow
// 		if err := rows.Scan(&r.UserID, &r.Role, &r.JoinedAt); err == nil {
// 			out = append(out, r)
// 		}
// 	}
// 	return out, nil
// }

// GetMembersByGroup returns minimal membership rows, ordered with admin first,
// then by user name/email for stable UI.
func GetMembersByGroup(groupID int) ([]GroupMemberRow, error) {
	const q = `
	  SELECT
	    gm.user_id,
	    gm.group_id,
	    gm.role,
	    COALESCE(gm.status, 'active') AS status,
	    to_char(gm.joined_at, 'YYYY-MM-DD"T"HH24:MI:SSZ')
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
		if err := rows.Scan(
			&r.UserID,
			&r.GroupId,
			&r.Role,
			&r.Status,
			&r.JoinedAt,
		); err != nil {
			return nil, err
		}
		out = append(out, r)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}

// IsUserInGroup returns (exists, role, status, error).
// Use this to quickly gate access to group details.
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

// GroupWithMembers is a snapshot for authorized users.
type GroupWithMembers struct {
	Group         Group            `json:"group"`
	Members       []GroupMemberRow `json:"members"`
	CurrentRole   string           `json:"currentRole"`
	CurrentStatus string           `json:"currentStatus"`
}

// GetGroupDetailsForUser returns group + members if the user is an active member.
// If the user is not in the group (or not active), it returns sql.ErrNoRows.
func GetGroupDetailsForUser(groupID, userID int) (*GroupWithMembers, error) {
	// Gate by membership
	ok, role, status, err := IsUserInGroup(groupID, userID)
	if err != nil {
		return nil, err
	}
	if !ok || status != "active" {
		return nil, sql.ErrNoRows
	}

	// Fetch group (align column names with your schema)
	const qGroup = `
	  SELECT
	    g.id,
	    COALESCE(g.admin_id, 0) AS admin_id,
	 	g.name,
	 	COALESCE(g.description, '') AS description,
	 	g.members_count,
	 	CASE
	 	  WHEN g.last_activity IS NOT NULL
	 	    THEN to_char(g.last_activity, 'YYYY-MM-DD"T"HH24:MI:SSZ')
	 	  ELSE NULL
	 	END AS last_activity
	  FROM groups g
	  WHERE g.id = $1
	  LIMIT 1`
	var grp Group
	var lastAct sql.NullString
	if err := database.DB.QueryRow(qGroup, groupID).Scan(
		&grp.Id,
		&grp.AdminId,
		&grp.Name,
		&grp.Description,
		&grp.MembersCount,
		&lastAct,
	); err != nil {
		return nil, err
	}
	if lastAct.Valid {
		grp.LastActivity = &lastAct.String
	} else {
		grp.LastActivity = nil
	}
	// UnreadCount is front-end only; keep nil/0 as-is.

	// Fetch members
	members, err := GetMembersByGroup(groupID)
	if err != nil {
		return nil, err
	}

	return &GroupWithMembers{
		Group:         grp,
		Members:       members,
		CurrentRole:   role,
		CurrentStatus: status,
	}, nil
}

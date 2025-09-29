package models

import (
	"database/sql"
	"errors"
	"travel_mate/backend/database"
)

type Group struct {
	Id           int     `json:"id"`
	Name         string  `json:"name"`
	Description  string  `json:"description"`
	MembersCount *int    `json:"membersCount,omitempty"`
	LastActivity *string `json:"lastActivity,omitempty"`
	UnreadCount  *int    `json:"unreadCount,omitempty"` // frontend safe; always null/0 for now
}

func CreateGroup(creatorID int, name, description string) (int, error) {
	const q1 = `INSERT INTO groups (name, description) VALUES ($1,$2) RETURNING id`
	var gid int
	if err := database.DB.QueryRow(q1, name, description).Scan(&gid); err != nil {
		return 0, err
	}
	// add creator as admin
	const q2 = `INSERT INTO group_members (group_id, user_id, role) VALUES ($1,$2,'admin')`
	if _, err := database.DB.Exec(q2, gid, creatorID); err != nil {
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

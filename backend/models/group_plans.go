package models

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"travel_mate/backend/database"
)

type GroupPlan struct {
	ID          int       `json:"id"`
	GroupID     int       `json:"group_id"`
	CreatorID   int       `json:"creator_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description,omitempty"`
	Destination *string   `json:"destination,omitempty"`
	StartDate   *string   `json:"start_date,omitempty"`
	EndDate     *string   `json:"end_date,omitempty"`
	Budget      *string   `json:"budget,omitempty"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type GroupPlanWithDetails struct {
	GroupPlan
	CreatorName  string `json:"creator_name"`
	CreatorEmail string `json:"creator_email"`
	CommentCount int    `json:"comment_count"`
}

type GroupPlanComment struct {
	ID        int       `json:"id"`
	PlanID    int       `json:"plan_id"`
	UserID    int       `json:"user_id"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
	UserName  string    `json:"user_name"`
	UserEmail string    `json:"user_email"`
}

// CreateGroupPlan creates a new trip plan for a group
func CreateGroupPlan(groupID, creatorID int, title string, description, destination, startDate, endDate, budget *string) (int, error) {
	const q = `
		INSERT INTO group_plans (group_id, creator_id, title, description, destination, start_date, end_date, budget, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
		RETURNING id`
	
	var id int
	err := database.DB.QueryRow(q, groupID, creatorID, title, description, destination, startDate, endDate, budget).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to create group plan: %w", err)
	}
	return id, nil
}

// ListGroupPlans returns all plans for a group with creator info and comment counts
func ListGroupPlans(groupID int) ([]GroupPlanWithDetails, error) {
	const q = `
		SELECT 
			p.id,
			p.group_id,
			p.creator_id,
			p.title,
			p.description,
			p.destination,
			p.start_date,
			p.end_date,
			p.budget,
			p.status,
			p.created_at,
			p.updated_at,
			COALESCE(u.name, u.first_name || ' ' || u.last_name, u.email, '') as creator_name,
			u.email as creator_email,
			COALESCE(cc.comment_count, 0) as comment_count
		FROM group_plans p
		JOIN users u ON u.id = p.creator_id
		LEFT JOIN (
			SELECT plan_id, COUNT(*)::int as comment_count
			FROM group_plan_comments
			GROUP BY plan_id
		) cc ON cc.plan_id = p.id
		WHERE p.group_id = $1
		ORDER BY p.created_at DESC`
	
	rows, err := database.DB.Query(q, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var plans []GroupPlanWithDetails
	for rows.Next() {
		var p GroupPlanWithDetails
		var desc, dest, startDate, endDate, budget sql.NullString
		
		if err := rows.Scan(
			&p.ID, &p.GroupID, &p.CreatorID, &p.Title,
			&desc, &dest, &startDate, &endDate, &budget,
			&p.Status, &p.CreatedAt, &p.UpdatedAt,
			&p.CreatorName, &p.CreatorEmail, &p.CommentCount,
		); err != nil {
			return nil, err
		}
		
		if desc.Valid {
			p.Description = &desc.String
		}
		if dest.Valid {
			p.Destination = &dest.String
		}
		if startDate.Valid {
			p.StartDate = &startDate.String
		}
		if endDate.Valid {
			p.EndDate = &endDate.String
		}
		if budget.Valid {
			p.Budget = &budget.String
		}
		
		plans = append(plans, p)
	}
	return plans, rows.Err()
}

// GetGroupPlanByID returns a single plan with details
func GetGroupPlanByID(planID int) (*GroupPlanWithDetails, error) {
	const q = `
		SELECT 
			p.id,
			p.group_id,
			p.creator_id,
			p.title,
			p.description,
			p.destination,
			p.start_date,
			p.end_date,
			p.budget,
			p.status,
			p.created_at,
			p.updated_at,
			COALESCE(u.name, u.first_name || ' ' || u.last_name, u.email, '') as creator_name,
			u.email as creator_email,
			COALESCE(cc.comment_count, 0) as comment_count
		FROM group_plans p
		JOIN users u ON u.id = p.creator_id
		LEFT JOIN (
			SELECT plan_id, COUNT(*)::int as comment_count
			FROM group_plan_comments
			GROUP BY plan_id
		) cc ON cc.plan_id = p.id
		WHERE p.id = $1`
	
	var p GroupPlanWithDetails
	var desc, dest, startDate, endDate, budget sql.NullString
	
	err := database.DB.QueryRow(q, planID).Scan(
		&p.ID, &p.GroupID, &p.CreatorID, &p.Title,
		&desc, &dest, &startDate, &endDate, &budget,
		&p.Status, &p.CreatedAt, &p.UpdatedAt,
		&p.CreatorName, &p.CreatorEmail, &p.CommentCount,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("plan not found")
		}
		return nil, err
	}
	
	if desc.Valid {
		p.Description = &desc.String
	}
	if dest.Valid {
		p.Destination = &dest.String
	}
	if startDate.Valid {
		p.StartDate = &startDate.String
	}
	if endDate.Valid {
		p.EndDate = &endDate.String
	}
	if budget.Valid {
		p.Budget = &budget.String
	}
	
	return &p, nil
}

// UpdateGroupPlan updates a plan (only creator can update)
func UpdateGroupPlan(planID, userID int, title string, description, destination, startDate, endDate, budget *string, status *string) error {
	// Verify ownership
	const checkQ = `SELECT creator_id FROM group_plans WHERE id = $1`
	var creatorID int
	if err := database.DB.QueryRow(checkQ, planID).Scan(&creatorID); err != nil {
		if err == sql.ErrNoRows {
			return errors.New("plan not found")
		}
		return err
	}
	if creatorID != userID {
		return errors.New("only the creator can update this plan")
	}

	const q = `
		UPDATE group_plans
		SET title = $1,
		    description = $2,
		    destination = $3,
		    start_date = $4,
		    end_date = $5,
		    budget = $6,
		    status = COALESCE($7, status),
		    updated_at = NOW()
		WHERE id = $8`
	
	_, err := database.DB.Exec(q, title, description, destination, startDate, endDate, budget, status, planID)
	return err
}

// DeleteGroupPlan deletes a plan (only creator can delete)
func DeleteGroupPlan(planID, userID int) error {
	// Verify ownership
	const checkQ = `SELECT creator_id FROM group_plans WHERE id = $1`
	var creatorID int
	if err := database.DB.QueryRow(checkQ, planID).Scan(&creatorID); err != nil {
		if err == sql.ErrNoRows {
			return errors.New("plan not found")
		}
		return err
	}
	if creatorID != userID {
		return errors.New("only the creator can delete this plan")
	}

	const q = `DELETE FROM group_plans WHERE id = $1`
	_, err := database.DB.Exec(q, planID)
	return err
}

// AddPlanComment adds a comment to a plan
func AddPlanComment(planID, userID int, comment string) (int, error) {
	const q = `
		INSERT INTO group_plan_comments (plan_id, user_id, comment)
		VALUES ($1, $2, $3)
		RETURNING id`
	
	var id int
	err := database.DB.QueryRow(q, planID, userID, comment).Scan(&id)
	if err != nil {
		return 0, fmt.Errorf("failed to add comment: %w", err)
	}
	return id, nil
}

// ListPlanComments returns all comments for a plan
func ListPlanComments(planID int) ([]GroupPlanComment, error) {
	const q = `
		SELECT 
			c.id,
			c.plan_id,
			c.user_id,
			c.comment,
			c.created_at,
			COALESCE(u.name, u.first_name || ' ' || u.last_name, u.email, '') as user_name,
			u.email as user_email
		FROM group_plan_comments c
		JOIN users u ON u.id = c.user_id
		WHERE c.plan_id = $1
		ORDER BY c.created_at ASC`
	
	rows, err := database.DB.Query(q, planID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []GroupPlanComment
	for rows.Next() {
		var c GroupPlanComment
		if err := rows.Scan(&c.ID, &c.PlanID, &c.UserID, &c.Comment, &c.CreatedAt, &c.UserName, &c.UserEmail); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}
	return comments, rows.Err()
}

// DeletePlanComment deletes a comment (only comment author can delete)
func DeletePlanComment(commentID, userID int) error {
	// Verify ownership
	const checkQ = `SELECT user_id FROM group_plan_comments WHERE id = $1`
	var commentUserID int
	if err := database.DB.QueryRow(checkQ, commentID).Scan(&commentUserID); err != nil {
		if err == sql.ErrNoRows {
			return errors.New("comment not found")
		}
		return err
	}
	if commentUserID != userID {
		return errors.New("only the comment author can delete this comment")
	}

	const q = `DELETE FROM group_plan_comments WHERE id = $1`
	_, err := database.DB.Exec(q, commentID)
	return err
}



package models

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/lib/pq"
	"travel_mate/backend/database"
)

// GroupPoll is the persisted poll record.
type GroupPoll struct {
	ID        int       `json:"id"`
	GroupID   int       `json:"groupId"`
	CreatorID int       `json:"creatorId"`
	Question  string    `json:"question"`
	Options   []string  `json:"options"`
	CreatedAt time.Time `json:"createdAt"`
}

// GroupPollWithCounts extends a poll with aggregated vote counts.
type GroupPollWithCounts struct {
	ID         int       `json:"id"`
	GroupID    int       `json:"groupId"`
	CreatorID  int       `json:"creatorId"`
	CreatorName string   `json:"creatorName"`
	Question   string    `json:"question"`
	Options    []string  `json:"options"`
	Counts     []int     `json:"counts"`
	UserVote   *int      `json:"userVote,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
}

// CreateGroupPoll inserts a new poll for the given group if the creator is an active member.
func CreateGroupPoll(groupID, creatorID int, question string, options []string) (int, error) {
	q := strings.TrimSpace(question)
	if len(q) < 4 {
		return 0, errors.New("question must be at least 4 characters")
	}

	clean := make([]string, 0, len(options))
	for _, opt := range options {
		if trimmed := strings.TrimSpace(opt); trimmed != "" {
			clean = append(clean, trimmed)
		}
	}
	if len(clean) < 2 {
		return 0, errors.New("at least 2 options are required")
	}

	isMember, _, status, err := IsUserInGroup(groupID, creatorID)
	if err != nil {
		return 0, fmt.Errorf("failed membership check: %w", err)
	}
	if !isMember || status != "active" {
		return 0, errors.New("only active group members can create polls")
	}

	const insert = `
	  INSERT INTO group_polls (group_id, creator_id, question, options)
	  VALUES ($1, $2, $3, $4)
	  RETURNING id`

	var id int
	if err := database.DB.QueryRow(insert, groupID, creatorID, q, pq.StringArray(clean)).Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

// ListGroupPolls returns all polls for the given group (latest first) with vote counts.
func ListGroupPolls(groupID, userID int) ([]GroupPollWithCounts, error) {
	const q = `
	  SELECT
	    p.id,
	    p.group_id,
	    p.creator_id,
	    COALESCE(u.name, u.first_name || ' ' || u.last_name, u.email, '') as creator_name,
	    p.question,
	    p.options,
	    p.created_at,
	    COALESCE(v.counts, ARRAY[]::int[]),
	    (
	      SELECT option_index
	      FROM group_poll_votes
	      WHERE poll_id = p.id AND voter_id = $2
	      LIMIT 1
	    ) AS user_vote
	  FROM group_polls p
	  LEFT JOIN users u ON u.id = p.creator_id
	  LEFT JOIN (
	    SELECT
	      poll_id,
	      ARRAY_AGG(count_per_option ORDER BY option_index) AS counts
	    FROM (
	      SELECT
	        poll_id,
	        option_index,
	        COUNT(*)::int AS count_per_option
	      FROM group_poll_votes
	      GROUP BY poll_id, option_index
	    ) t
	    GROUP BY poll_id
	  ) v ON v.poll_id = p.id
	  WHERE p.group_id = $1
	  ORDER BY p.created_at DESC`

	rows, err := database.DB.Query(q, groupID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []GroupPollWithCounts
	for rows.Next() {
		var (
			record GroupPollWithCounts
			opts   pq.StringArray
			counts pq.Int64Array
			myVote sql.NullInt64
		)
		if err := rows.Scan(&record.ID, &record.GroupID, &record.CreatorID, &record.CreatorName, &record.Question, &opts, &record.CreatedAt, &counts, &myVote); err != nil {
			return nil, err
		}

		record.Options = append(record.Options, opts...)
		
		// Query to get option_index -> count mapping directly
		// This ensures counts are properly aligned with option indices
		const countQuery = `
			SELECT option_index, COUNT(*)::int
			FROM group_poll_votes
			WHERE poll_id = $1
			GROUP BY option_index
			ORDER BY option_index`
		
		countMap := make(map[int]int)
		countRows, err := database.DB.Query(countQuery, record.ID)
		if err == nil {
			defer countRows.Close()
			for countRows.Next() {
				var optIdx int
				var cnt int
				if err := countRows.Scan(&optIdx, &cnt); err == nil {
					countMap[optIdx] = cnt
				}
			}
		}
		
		// Build counts array aligned with option indices (0, 1, 2, ...)
		// Initialize with zeros, then fill in actual counts
		record.Counts = make([]int, len(record.Options))
		for i := range record.Options {
			if cnt, exists := countMap[i]; exists {
				record.Counts[i] = cnt
			} else {
				record.Counts[i] = 0
			}
		}

		if myVote.Valid {
			mv := int(myVote.Int64)
			record.UserVote = &mv
		}

		out = append(out, record)
	}
	return out, rows.Err()
}

// VoteOnPoll inserts or updates a user's vote for a poll.
func VoteOnPoll(groupID, pollID, voterID, optionIndex int) error {
	isMember, _, status, err := IsUserInGroup(groupID, voterID)
	if err != nil {
		return fmt.Errorf("failed membership check: %w", err)
	}
	if !isMember || status != "active" {
		return errors.New("only active group members can vote")
	}

	const qPoll = `
	  SELECT array_length(options, 1)
	  FROM group_polls
	  WHERE id = $1 AND group_id = $2`

	var optLen sql.NullInt64
	if err := database.DB.QueryRow(qPoll, pollID, groupID).Scan(&optLen); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return errors.New("poll not found in this group")
		}
		return err
	}
	if !optLen.Valid || optionIndex < 0 || optionIndex >= int(optLen.Int64) {
		return errors.New("invalid option index")
	}

	const upsert = `
	  INSERT INTO group_poll_votes (poll_id, voter_id, option_index)
	  VALUES ($1, $2, $3)
	  ON CONFLICT (poll_id, voter_id)
	  DO UPDATE SET option_index = EXCLUDED.option_index`

	_, err = database.DB.Exec(upsert, pollID, voterID, optionIndex)
	return err
}

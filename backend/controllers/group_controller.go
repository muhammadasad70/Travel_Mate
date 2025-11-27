// controllers/groups.go
package controllers

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"travel_mate/backend/database"
	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

func CreateGroup(c *gin.Context) {
	// CONSISTENT: use "user_id" everywhere
	uidAny, ok := c.Get("user_id")
	if !ok {
		log.Println("[CreateGroup] ERROR: user_id not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	creatorID, ok := uidAny.(int)
	if !ok {
		log.Printf("[CreateGroup] ERROR: user_id has wrong type: %T", uidAny)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user_id"})
		return
	}

	if creatorID <= 0 {
		log.Printf("[CreateGroup] ERROR: invalid creatorID: %d", creatorID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	log.Printf("[CreateGroup] ✓ Got creatorID=%d from context", creatorID)

	var in struct {
		Name        string `json:"name"`
		Description string `json:"description"`
	}
	if err := c.ShouldBindJSON(&in); err != nil {
		log.Printf("[CreateGroup] bind error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}
	name := strings.TrimSpace(in.Name)
	desc := strings.TrimSpace(in.Description)

	log.Printf("[CreateGroup] user=%d name=%q desc=%q", creatorID, name, desc)

	// Validation - matches DB constraints
	if len(name) < 4 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Group name must be at least 4 characters"})
		return
	}
	if len(desc) < 10 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Description must be at least 10 characters"})
		return
	}

	gid, err := models.CreateGroup(creatorID, name, desc)
	if err != nil {
		log.Printf("[CreateGroup] models.CreateGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create group", "details": err.Error()})
		return
	}

	log.Printf("[CreateGroup] success: group_id=%d", gid)
	c.JSON(http.StatusCreated, gin.H{"id": gid, "name": name, "description": desc})
}

func GetMyGroups(c *gin.Context) {
	uid, _ := c.Get("user_id")
	userID, _ := uid.(int)

	gs, err := models.GetGroupsByUser(userID)
	if err != nil {
		log.Printf("[GetMyGroups] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch groups"})
		return
	}
	c.JSON(http.StatusOK, gs)
}

func GetGroup(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	g, err := models.GetGroupByID(id)
	if err != nil {
		log.Printf("[GetGroup] error: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}
	c.JSON(http.StatusOK, g)
}

// ============ INVITE CONTROLLERS ============

// POST /groups/:group_id/invites - Create a new invite
func CreateGroupInvite(c *gin.Context) {
	groupParam := c.Param("group_id")
	groupID, err := strconv.Atoi(groupParam)
	if err != nil || groupID <= 0 {
		log.Printf("[CreateGroupInvite] bad group_id=%q err=%v", groupParam, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uid, _ := c.Get("user_id")
	inviterID, _ := uid.(int)

	if inviterID <= 0 {
		log.Printf("[CreateGroupInvite] invalid inviter_id: %v", inviterID)
		c.JSON(http.StatusBadRequest, gin.H{"error": "inviter_id is required and must be > 0"})
		return
	}

	var body struct {
		InviteeID    *int    `json:"invitee_id,omitempty"`
		InviteeEmail *string `json:"invitee_email,omitempty"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		log.Printf("[CreateGroupInvite] bind json error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON body"})
		return
	}

	// Validate invitee presence
	if body.InviteeID == nil && body.InviteeEmail == nil {
		log.Printf("[CreateGroupInvite] missing invitee")
		c.JSON(http.StatusBadRequest, gin.H{"error": "either invitee_id or invitee_email is required"})
		return
	}

	// Permission check: must be admin
	isAdmin, err := models.IsAdmin(groupID, inviterID)
	if err != nil {
		log.Printf("[CreateGroupInvite] IsAdmin(group=%d, user=%d) err=%v", groupID, inviterID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permissions"})
		return
	}
	if !isAdmin {
		log.Printf("[CreateGroupInvite] user %d not admin of group %d", inviterID, groupID)
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can invite members"})
		return
	}

	// Invite by ID (preferred)
	if body.InviteeID != nil {
		inviteeID := *body.InviteeID
		log.Printf("[CreateGroupInvite] invite by id -> group=%d inviter=%d invitee=%d", groupID, inviterID, inviteeID)

		if err := models.CreateGroupInvite(groupID, inviterID, inviteeID); err != nil {
			if strings.Contains(err.Error(), "already a member") ||
				strings.Contains(err.Error(), "duplicate key") ||
				strings.Contains(err.Error(), "already exists") {
				log.Printf("[CreateGroupInvite] conflict: %v", err)
				c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
				return
			}
			log.Printf("[CreateGroupInvite] db error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create invite"})
			return
		}

		// Create notification for the invitee (async)
		go func() {
			// Get inviter name
			var inviterName string
			const getInviterName = `SELECT COALESCE(name, first_name || ' ' || last_name, email, 'An admin') FROM users WHERE id = $1`
			database.DB.QueryRow(getInviterName, inviterID).Scan(&inviterName)

			// Get group name
			group, err := models.GetGroupByID(groupID)
			groupName := "a group"
			if err == nil {
				groupName = group.Name
			}

			// Notify the invitee
			groupID64 := int64(groupID)
			relatedType := "group"
			notification := models.Notification{
				UserID:      int64(inviteeID),
				Type:        "group_invite",
				Title:       "Group Invitation",
				Message:     fmt.Sprintf("%s invited you to join %s", inviterName, groupName),
				RelatedID:   &groupID64,
				RelatedType: &relatedType,
				IsRead:      false,
			}
			if err := models.CreateNotification(&notification); err != nil {
				log.Printf("[CreateGroupInvite] Failed to notify invitee: %v", err)
			}
			
			// Notify all group members (except the inviter) about the new invite
			if err := models.NotifyGroupMembers(
				groupID,
				inviterID,
				"group_invite",
				"New Member Invited",
				fmt.Sprintf("%s invited a new member to join %s", inviterName, groupName),
			); err != nil {
				log.Printf("[CreateGroupInvite] Failed to notify group members: %v", err)
			}
		}()

		c.JSON(http.StatusCreated, gin.H{
			"group_id":   groupID,
			"invitee_id": inviteeID,
			"status":     "pending",
			"created_by": inviterID,
		})
		return
	}

	// Invite by email (if you support it)
	if body.InviteeEmail != nil {
		inviteeEmail := strings.TrimSpace(*body.InviteeEmail)
		if inviteeEmail == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invitee_email cannot be empty"})
			return
		}
		log.Printf("[CreateGroupInvite] invite by email not yet implemented")
		c.JSON(http.StatusBadRequest, gin.H{"error": "invite by email not supported yet"})
		return
	}
}

// GET /groups/invites/mine
func ListMyInvites(c *gin.Context) {
	uid, _ := c.Get("user_id")
	userID, _ := uid.(int)

	invites, err := models.GetPendingInvitesForUser(userID)
	if err != nil {
		log.Printf("[ListMyInvites] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load invites"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"invites": invites})
}

// POST /groups/invites/:invite_id/accept
func AcceptInvite(c *gin.Context) {
	inviteParam := c.Param("invite_id")
	inviteID, err := strconv.Atoi(inviteParam)
	if err != nil || inviteID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invite ID"})
		return
	}

	uid, _ := c.Get("user_id")
	userID, _ := uid.(int)

	// Check ownership
	isOwner, err := models.IsInviteForUser(inviteID, userID)
	if err != nil {
		log.Printf("[AcceptInvite] verification error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "verification failed"})
		return
	}
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "not your invite"})
		return
	}

	added, err := models.UpdateInviteStatus(inviteID, "accepted")
	if err != nil {
		log.Printf("[AcceptInvite] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to accept invite"})
		return
	}

	// Create notification for group members when a new member joins
	if added {
		// Get group ID and user info for notification
		groupID, err := models.GetGroupIDByInvite(inviteID)
		if err == nil {
			// Get group info (for conversation title and notification)
			group, err := models.GetGroupByID(groupID)
			groupName := "the group"
			if err == nil {
				groupName = group.Name
			}
			
			// Add user to group conversation (automatic when member joins)
			groupNamePtr := &groupName
			_, _, _, err = models.AddUserToGroupConversationOnJoin(groupID, userID, groupNamePtr)
			if err != nil {
				log.Printf("[AcceptInvite] Failed to add user to group conversation: %v", err)
				// Don't fail the request if conversation add fails
			} else {
				log.Printf("[AcceptInvite] User %d automatically added to group conversation for group %d", userID, groupID)
			}

			// Get user name for notification
			var userName string
			const getUserName = `SELECT COALESCE(name, first_name || ' ' || last_name, email, 'A member') FROM users WHERE id = $1`
			database.DB.QueryRow(getUserName, userID).Scan(&userName)

			// Notify all group members (except the new member)
			if err := models.NotifyGroupMembers(
				groupID,
				userID,
				"group_member_joined",
				"New Member Joined",
				fmt.Sprintf("%s joined %s", userName, groupName),
			); err != nil {
				log.Printf("[AcceptInvite] Failed to notify group members: %v", err)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"invite_id":    inviteID,
		"accepted":     true,
		"member_added": added,
	})
}

// POST /groups/invites/:invite_id/decline
func DeclineInvite(c *gin.Context) {
	inviteParam := c.Param("invite_id")
	inviteID, err := strconv.Atoi(inviteParam)
	if err != nil || inviteID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invite ID"})
		return
	}

	uid, _ := c.Get("user_id")
	userID, _ := uid.(int)

	isOwner, err := models.IsInviteForUser(inviteID, userID)
	if err != nil {
		log.Printf("[DeclineInvite] verification error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "verification failed"})
		return
	}
	if !isOwner {
		c.JSON(http.StatusForbidden, gin.H{"error": "not your invite"})
		return
	}

	_, err = models.UpdateInviteStatus(inviteID, "declined")
	if err != nil {
		log.Printf("[DeclineInvite] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to decline invite"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"invite_id": inviteID,
		"declined":  true,
	})
}

// POST /groups/invites/:invite_id/cancel (admin-only)
func CancelGroupInviteHandler(c *gin.Context) {
	inviteParam := c.Param("invite_id")
	inviteID, err := strconv.Atoi(inviteParam)
	if err != nil || inviteID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid invite ID"})
		return
	}

	uid, _ := c.Get("user_id")
	userID, _ := uid.(int)

	// Get related group ID
	groupID, err := models.GetGroupIDByInvite(inviteID)
	if err != nil {
		log.Printf("[CancelInvite] GetGroupIDByInvite error: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "invite not found"})
		return
	}

	// Ensure user is admin of that group
	isAdmin, err := models.IsAdmin(groupID, userID)
	if err != nil {
		log.Printf("[CancelInvite] IsAdmin error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permissions"})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "admin only"})
		return
	}

	_, err = models.UpdateInviteStatus(inviteID, "canceled")
	if err != nil {
		log.Printf("[CancelInvite] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to cancel invite"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"invite_id": inviteID,
		"canceled":  true,
	})
}

// GET /groups/:group_id/invites - FIXED FUNCTION NAME
func ListGroupInvitesForGroup(c *gin.Context) {
	groupParam := c.Param("group_id")
	groupID, err := strconv.Atoi(groupParam)
	if err != nil || groupID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uid, _ := c.Get("user_id")
	userID, _ := uid.(int)

	// Check if requester is admin of the group
	isAdmin, err := models.IsAdmin(groupID, userID)
	if err != nil {
		log.Printf("[ListGroupInvites] IsAdmin error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permission"})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can view group invites"})
		return
	}

	invites, err := models.GetPendingInvitesForGroup(groupID)
	if err != nil {
		log.Printf("[ListGroupInvites] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list invites"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"group_id": groupID,
		"invites":  invites,
	})
}

// GET /groups/:group_id/members
func ListGroupMembers(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	rows, err := models.GetMembersByGroup(gid)
	if err != nil {
		log.Printf("[ListGroupMembers] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load members"})
		return
	}
	c.JSON(http.StatusOK, rows)
}

// DELETE /groups/:group_id/members/:user_id (admin-only)
func RemoveGroupMember(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uidParam := c.Param("user_id")
	userIDToRemove, err := strconv.Atoi(uidParam)
	if err != nil || userIDToRemove <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id"})
		return
	}

	// Get current user from JWT
	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	currentUserID, ok := uidAny.(int)
	if !ok || currentUserID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	// Check if current user is admin
	isAdmin, err := models.IsAdmin(gid, currentUserID)
	if err != nil {
		log.Printf("[RemoveGroupMember] IsAdmin error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check permission"})
		return
	}
	if !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "only admins can remove members"})
		return
	}

	// Prevent admin from removing themselves
	if currentUserID == userIDToRemove {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cannot remove yourself from the group"})
		return
	}

	// Check if user to remove is in the group
	isMember, _, _, err := models.IsUserInGroup(gid, userIDToRemove)
	if err != nil {
		log.Printf("[RemoveGroupMember] IsUserInGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify membership"})
		return
	}
	if !isMember {
		c.JSON(http.StatusNotFound, gin.H{"error": "user is not a member of this group"})
		return
	}

	// Note: Allowing removal of other admins - you can add this check back if needed
	// If you want to prevent removing other admins, uncomment:
	// isMember, role, _, err := models.IsUserInGroup(gid, userIDToRemove)
	// if role == "admin" {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "cannot remove another admin"})
	// 	return
	// }

	// Remove the member
	err = models.RemoveUserFromGroup(gid, userIDToRemove)
	if err != nil {
		log.Printf("[RemoveGroupMember] RemoveUserFromGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to remove member"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Member removed successfully",
		"user_id": userIDToRemove,
	})
}

// ============ POLLS (GROUP MEMBERS) ============

// POST /groups/:group_id/polls
// Body: { "question": "Where to go?", "options": ["Hunza", "Skardu", "Murree"] }
func CreateGroupPollHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	var body struct {
		Question string   `json:"question"`
		Options  []string `json:"options"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON body"})
		return
	}

	id, err := models.CreateGroupPoll(gid, userID, body.Question, body.Options)
	if err != nil {
		log.Printf("[CreateGroupPoll] error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create notification for group members about new poll (async)
	go func() {
		// Get user name
		var userName string
		const getUserName = `SELECT COALESCE(name, first_name || ' ' || last_name, email, 'A member') FROM users WHERE id = $1`
		database.DB.QueryRow(getUserName, userID).Scan(&userName)

		// Get group name
		group, err := models.GetGroupByID(gid)
		groupName := "the group"
		if err == nil {
			groupName = group.Name
		}

		// Notify all group members (except the creator)
		if err := models.NotifyGroupMembers(
			gid,
			userID,
			"group_poll_created",
			"New Poll Created",
			fmt.Sprintf("%s created a new poll in %s: %s", userName, groupName, body.Question),
		); err != nil {
			log.Printf("[CreateGroupPoll] Failed to notify group members: %v", err)
		}
	}()

	c.JSON(http.StatusCreated, gin.H{
		"id":        id,
		"group_id":  gid,
		"creatorId": userID,
	})
}

// GET /groups/:group_id/polls
func ListGroupPollsHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	// Optional: ensure caller is member — reuse IsUserInGroup
	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	isMember, _, status, err := models.IsUserInGroup(gid, userID)
	if err != nil {
		log.Printf("[ListGroupPolls] IsUserInGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check membership"})
		return
	}
	if !isMember || status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only members can view polls"})
		return
	}

	polls, err := models.ListGroupPolls(gid, userID)
	if err != nil {
		log.Printf("[ListGroupPolls] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load polls"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"polls": polls})
}

// POST /groups/:group_id/polls/:poll_id/vote
// Body: { "optionIndex": 0 }
func VoteOnGroupPollHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}
	pid, err := strconv.Atoi(c.Param("poll_id"))
	if err != nil || pid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid poll_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	var body struct {
		OptionIndex int `json:"optionIndex"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON body"})
		return
	}

	if err := models.VoteOnPoll(gid, pid, userID, body.OptionIndex); err != nil {
		log.Printf("[VoteOnGroupPoll] error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create notification for group members about poll vote (async)
	go func() {
		// Get user name
		var userName string
		const getUserName = `SELECT COALESCE(name, first_name || ' ' || last_name, email, 'A member') FROM users WHERE id = $1`
		database.DB.QueryRow(getUserName, userID).Scan(&userName)

		// Get poll question
		var question string
		const getPoll = `SELECT question FROM group_polls WHERE id = $1`
		database.DB.QueryRow(getPoll, pid).Scan(&question)

		// Get group name
		group, err := models.GetGroupByID(gid)
		groupName := "the group"
		if err == nil {
			groupName = group.Name
		}

		// Notify all group members (except the voter)
		if err := models.NotifyGroupMembers(
			gid,
			userID,
			"group_poll_voted",
			"Poll Vote",
			fmt.Sprintf("%s voted on a poll in %s: %s", userName, groupName, question),
		); err != nil {
			log.Printf("[VoteOnGroupPoll] Failed to notify group members: %v", err)
		}
	}()

	c.JSON(http.StatusOK, gin.H{"ok": true})
}

// ============ GROUP PLANS (TRIP PLANS) ============

// POST /groups/:group_id/plans
// Body: { "title": "...", "description": "...", "destination": "...", "start_date": "...", "end_date": "...", "budget": "..." }
func CreateGroupPlanHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	// Verify user is a member
	isMember, _, status, err := models.IsUserInGroup(gid, userID)
	if err != nil {
		log.Printf("[CreateGroupPlan] IsUserInGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check membership"})
		return
	}
	if !isMember || status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only members can create plans"})
		return
	}

	var req struct {
		Title       string  `json:"title" binding:"required"`
		Description *string `json:"description"`
		Destination *string `json:"destination"`
		StartDate   *string `json:"start_date"`
		EndDate     *string `json:"end_date"`
		Budget      *string `json:"budget"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	planID, err := models.CreateGroupPlan(gid, userID, req.Title, req.Description, req.Destination, req.StartDate, req.EndDate, req.Budget)
	if err != nil {
		log.Printf("[CreateGroupPlan] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": planID, "message": "Plan created successfully"})
}

// GET /groups/:group_id/plans
func ListGroupPlansHandler(c *gin.Context) {
	gid, err := strconv.Atoi(c.Param("group_id"))
	if err != nil || gid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid group_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	// Verify user is a member
	isMember, _, status, err := models.IsUserInGroup(gid, userID)
	if err != nil {
		log.Printf("[ListGroupPlans] IsUserInGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check membership"})
		return
	}
	if !isMember || status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only members can view plans"})
		return
	}

	plans, err := models.ListGroupPlans(gid)
	if err != nil {
		log.Printf("[ListGroupPlans] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load plans"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"plans": plans})
}

// GET /groups/:group_id/plans/:plan_id
func GetGroupPlanHandler(c *gin.Context) {
	planID, err := strconv.Atoi(c.Param("plan_id"))
	if err != nil || planID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid plan_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	plan, err := models.GetGroupPlanByID(planID)
	if err != nil {
		if err.Error() == "plan not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "plan not found"})
			return
		}
		log.Printf("[GetGroupPlan] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load plan"})
		return
	}

	// Verify user is a member of the group
	isMember, _, status, err := models.IsUserInGroup(plan.GroupID, userID)
	if err != nil {
		log.Printf("[GetGroupPlan] IsUserInGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check membership"})
		return
	}
	if !isMember || status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only members can view plans"})
		return
	}

	c.JSON(http.StatusOK, plan)
}

// PUT /groups/:group_id/plans/:plan_id
func UpdateGroupPlanHandler(c *gin.Context) {
	planID, err := strconv.Atoi(c.Param("plan_id"))
	if err != nil || planID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid plan_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	var req struct {
		Title       string  `json:"title"`
		Description *string `json:"description"`
		Destination *string `json:"destination"`
		StartDate   *string `json:"start_date"`
		EndDate     *string `json:"end_date"`
		Budget      *string `json:"budget"`
		Status      *string `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = models.UpdateGroupPlan(planID, userID, req.Title, req.Description, req.Destination, req.StartDate, req.EndDate, req.Budget, req.Status)
	if err != nil {
		if err.Error() == "plan not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "plan not found"})
			return
		}
		if strings.Contains(err.Error(), "only the creator") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		log.Printf("[UpdateGroupPlan] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Plan updated successfully"})
}

// DELETE /groups/:group_id/plans/:plan_id
func DeleteGroupPlanHandler(c *gin.Context) {
	planID, err := strconv.Atoi(c.Param("plan_id"))
	if err != nil || planID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid plan_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	err = models.DeleteGroupPlan(planID, userID)
	if err != nil {
		if err.Error() == "plan not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "plan not found"})
			return
		}
		if strings.Contains(err.Error(), "only the creator") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		log.Printf("[DeleteGroupPlan] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete plan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Plan deleted successfully"})
}

// POST /groups/:group_id/plans/:plan_id/comments
// Body: { "comment": "..." }
func AddPlanCommentHandler(c *gin.Context) {
	planID, err := strconv.Atoi(c.Param("plan_id"))
	if err != nil || planID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid plan_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	// Get plan to verify group membership
	plan, err := models.GetGroupPlanByID(planID)
	if err != nil {
		if err.Error() == "plan not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "plan not found"})
			return
		}
		log.Printf("[AddPlanComment] GetGroupPlanByID error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load plan"})
		return
	}

	// Verify user is a member
	isMember, _, status, err := models.IsUserInGroup(plan.GroupID, userID)
	if err != nil {
		log.Printf("[AddPlanComment] IsUserInGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check membership"})
		return
	}
	if !isMember || status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only members can comment"})
		return
	}

	var req struct {
		Comment string `json:"comment" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	commentID, err := models.AddPlanComment(planID, userID, req.Comment)
	if err != nil {
		log.Printf("[AddPlanComment] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to add comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": commentID, "message": "Comment added successfully"})
}

// GET /groups/:group_id/plans/:plan_id/comments
func ListPlanCommentsHandler(c *gin.Context) {
	planID, err := strconv.Atoi(c.Param("plan_id"))
	if err != nil || planID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid plan_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	// Get plan to verify group membership
	plan, err := models.GetGroupPlanByID(planID)
	if err != nil {
		if err.Error() == "plan not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "plan not found"})
			return
		}
		log.Printf("[ListPlanComments] GetGroupPlanByID error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load plan"})
		return
	}

	// Verify user is a member
	isMember, _, status, err := models.IsUserInGroup(plan.GroupID, userID)
	if err != nil {
		log.Printf("[ListPlanComments] IsUserInGroup error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check membership"})
		return
	}
	if !isMember || status != "active" {
		c.JSON(http.StatusForbidden, gin.H{"error": "only members can view comments"})
		return
	}

	comments, err := models.ListPlanComments(planID)
	if err != nil {
		log.Printf("[ListPlanComments] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

// DELETE /groups/:group_id/plans/:plan_id/comments/:comment_id
func DeletePlanCommentHandler(c *gin.Context) {
	commentID, err := strconv.Atoi(c.Param("comment_id"))
	if err != nil || commentID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment_id"})
		return
	}

	uidAny, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID, ok := uidAny.(int)
	if !ok || userID <= 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user context"})
		return
	}

	err = models.DeletePlanComment(commentID, userID)
	if err != nil {
		if err.Error() == "comment not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "comment not found"})
			return
		}
		if strings.Contains(err.Error(), "only the comment author") {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		log.Printf("[DeletePlanComment] error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}

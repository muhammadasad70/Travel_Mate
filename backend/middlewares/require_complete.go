// middlewares/require_complete.go
package middlewares

import (
	"net/http"
	"strings"

	"travel_mate/backend/models"

	"github.com/gin-gonic/gin"
)

func isProfileAllowPath(p string) bool {
	path := strings.TrimRight(p, "/")
	if path == "" {
		return false
	}
	// allow any /user/profile* route (update, get, avatar, etc.)
	if strings.HasPrefix(path, "/user/profile") {
		return true
	}
	// allow profile status checker if you use it
	if path == "/user/profile-status" {
		return true
	}
	return false
}

func RequireCompleteProfile() gin.HandlerFunc {
	return func(c *gin.Context) {
		route := c.FullPath()
		if route == "" {
			route = c.Request.URL.Path
		}

		// Allow profile endpoints so the user can finish profile
		if isProfileAllowPath(route) {
			c.Next()
			return
		}

		uidAny, ok := c.Get("user_id")
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		userID := uidAny.(int)

		u, err := models.GetUserByID(userID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		if !u.IsProfileComplete {
			// 428 = Precondition Required (clear message to client)
			c.AbortWithStatusJSON(http.StatusPreconditionRequired, gin.H{
				"error":     "Complete profile required",
				"completed": false,
			})
			return
		}
		c.Next()
	}
}

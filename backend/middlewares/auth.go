

package middlewares

import (
	"net/http"
	"strings"

	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Allow CORS preflight to pass through
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || parts[1] == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			return
		}

		claims, err := utils.VerifyToken(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// ---- REQUIRED: put user_id in Gin context ----
		var uid int
		switch v := claims["userId"].(type) {
		case float64:
			uid = int(v)
		case int:
			uid = v
		default:
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid userId in token"})
			return
		}
		c.Set("user_id", uid)

		// Optional extras
		if email, ok := claims["email"].(string); ok && email != "" {
			c.Set("email", email)
		}
		if role, ok := claims["role"].(string); ok && role != "" {
			c.Set("role", role)
		}

		c.Next()
	}
}

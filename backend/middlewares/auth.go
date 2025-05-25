package middlewares

import (
	"net/http"
	"strings"
	"travel_mate/backend/utils"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		claims, err := utils.VerifyToken(tokenParts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		userIDFloat, ok := claims["userId"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid userId in token"})
			c.Abort()
			return
		}

		c.Set("user_Id", int(userIDFloat))
		c.Next()
	}
}

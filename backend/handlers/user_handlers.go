package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func UserAthlete(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "user athlete"})
}

func UserActivities(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "user activities"})
}

func Logout(c *gin.Context) {
	c.JSON(http.StatusOK, 0)
}

func DeleteProfile(c *gin.Context) {
	c.JSON(http.StatusOK, 1)
}

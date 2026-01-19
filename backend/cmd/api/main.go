package main

import (
	"strava-activity-groups/backend/router"

	"github.com/gin-gonic/gin"
)

func main() {
	router := router.SetupRouter()

	router.GET("/hello", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello :)",
		})
	})

	router.Run()
}

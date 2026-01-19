package router

import (
	"strava-activity-groups/backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")

	auth := api.Group("/auth")
	{
		auth.GET("/login", handlers.Login)
		auth.GET("/refresh", handlers.Refresh)
	}

	strava := api.Group("/strava")
	{
		strava.GET("/athlete", handlers.StravaAthlete)
		strava.GET("/activities", handlers.StravaActivities)
	}

	user := api.Group("/user")
	{
		user.GET("/athlete", handlers.UserAthlete)
		user.GET("/activities", handlers.UserActivities)
		user.DELETE("/logout", handlers.Logout)
		user.DELETE("/delete", handlers.DeleteProfile)
	}

	return router
}

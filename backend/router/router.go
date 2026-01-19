package router

import (
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")

	auth := api.Group("/auth")
	{
		auth.GET("/login")
		auth.GET("/refresh")
	}

	strava := api.Group("/strava")
	{
		strava.GET("/athlete")
		strava.GET("/activities")
	}

	user := api.Group("/user")
	{
		user.GET("/athlete")
		user.GET("/activities")
		user.DELETE("/logout")
		user.DELETE("/delete")
	}

	return router
}

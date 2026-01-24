package router

import (
	"context"
	"log"
	"strava-activity-groups/backend/db"
	"strava-activity-groups/backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	ctx := context.Background()

	//connect to db
	pool, err := db.SetupPool(ctx)
	if err != nil {
		log.Fatal(err)
	}

	if err := pool.Ping(ctx); err != nil {
		log.Fatal("Database not reachable:", err)
	}

	//initialize router
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	//setup handlers with db pool
	authHandler := handlers.NewAuthHandler(pool)
	stravaHandler := handlers.NewStravaHandler(pool)
	userHandler := handlers.NewUserHandler(pool)

	//setup routes
	api := router.Group("/api")

	auth := api.Group("/auth")
	{
		auth.POST("/refresh", authHandler.Refresh)
		auth.GET("/strava/callback", authHandler.StravaCallback)
	}

	strava := api.Group("/strava")
	{
		strava.GET("/athlete", stravaHandler.StravaAthlete)
		strava.GET("/activities", stravaHandler.StravaActivities)
	}

	user := api.Group("/user")
	{
		user.GET("/athlete", userHandler.UserAthlete)
		user.GET("/activities", userHandler.UserActivities)
		user.DELETE("/logout", userHandler.Logout)
		user.DELETE("/delete", userHandler.DeleteProfile)
	}

	return router
}

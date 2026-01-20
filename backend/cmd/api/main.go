package main

import (
	"strava-activity-groups/backend/router"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	router := router.SetupRouter()

	router.Run()
}

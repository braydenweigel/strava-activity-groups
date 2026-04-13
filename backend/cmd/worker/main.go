package main

import (
	"context"
	"log"
	"strava-activity-groups/backend/db"
	"strava-activity-groups/backend/handlers"
	"strava-activity-groups/backend/worker"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	ctx := context.Background()

	pool, err := db.SetupPool(ctx)
	if err != nil {
		log.Fatal(err)
	}

	handler := handlers.NewStravaHandler(pool, nil)

	worker.StartWorker(handler)
}

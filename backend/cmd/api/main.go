package main

import (
	"context"
	"log"
	"strava-activity-groups/backend/db"
	"strava-activity-groups/backend/router"

	"github.com/hibiken/asynq"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	ctx := context.Background()

	//connect to db
	pool, err := db.SetupPool(ctx)
	if err != nil {
		log.Fatal(err)
	}

	if err := pool.Ping(ctx); err != nil {
		log.Fatal("Database not reachable:", err)
	}

	//initialize queue client
	queueClient := asynq.NewClient(asynq.RedisClientOpt{
		Addr: "localhost:6379",
		DB:   0,
	})
	defer queueClient.Close()

	router := router.SetupRouter(pool, queueClient)

	router.Run()
}

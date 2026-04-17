package worker

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"strava-activity-groups/backend/handlers"
	"strava-activity-groups/backend/models"

	"github.com/hibiken/asynq"
)

func StartWorker(h *handlers.StravaHandler) {
	server := asynq.NewServer(
		asynq.RedisClientOpt{Addr: os.Getenv("REDIS_ADDR"), DB: 0},
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"default": 1,
			},
		},
	)

	mux := asynq.NewServeMux()

	mux.HandleFunc("strava:webhook", func(ctx context.Context, t *asynq.Task) error {
		log.Println("Worker received task")

		var req models.StravaWebhookRequest

		if err := json.Unmarshal(t.Payload(), &req); err != nil {
			return err
		}

		err := h.ProcessWebhook(ctx, req)
		if err != nil {
			log.Println("ProcessWebhook error:", err)
			return err
		}

		log.Println("Webhook processed successfully")
		return nil
	})

	if err := server.Run(mux); err != nil {
		log.Fatal(err)
	}
}

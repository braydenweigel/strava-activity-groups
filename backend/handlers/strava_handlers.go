package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	db "strava-activity-groups/backend/db/lib"
	"strava-activity-groups/backend/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5/pgxpool"
)

type StravaHandler struct {
	DB    *pgxpool.Pool
	Queue *asynq.Client
}

func NewStravaHandler(db *pgxpool.Pool, queue *asynq.Client) *StravaHandler {
	return &StravaHandler{DB: db, Queue: queue}
}

func (h *StravaHandler) StravaWebhooks(c *gin.Context) {
	//validate JSON request
	var req models.StravaWebhookRequest
	if errJSON := c.ShouldBindJSON(&req); errJSON != nil {
		c.JSON(400, gin.H{"error": errJSON.Error()})
		return
	}

	//validate subscription id
	if strconv.Itoa(req.SubscriptionID) != os.Getenv(("SUBSCRIPTION_ID")) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Invalid subscription id"})
		return
	}

	//add task to queue
	payload, errMarshal := json.Marshal(req)
	if errMarshal != nil {
		c.JSON(500, gin.H{"error": "failed to marshal payload"})
		return
	}
	task := asynq.NewTask("strava:webhook", payload)

	if h.Queue != nil {
		_, err := h.Queue.Enqueue(task,
			asynq.MaxRetry(5),
			asynq.Timeout(30*time.Second),
		)

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
	}

	c.Status(200)
}

func (h *StravaHandler) StravaWebhooksVerify(c *gin.Context) {
	challenge := c.Query("hub.challenge")
	reqVerifyToken := c.Query("hub.verify_token")
	actualVerifyToken := os.Getenv("VERIFY_TOKEN")

	if reqVerifyToken != actualVerifyToken {
		c.Status(http.StatusBadRequest)
		return
	}

	c.JSON(http.StatusOK, gin.H{"hub.challenge": challenge})
}

func (h *StravaHandler) ProcessWebhook(c context.Context, req models.StravaWebhookRequest) error {
	log.Printf("Processing webhook: %+v\n", req)

	//determine event type
	if req.AspectType == "create" && req.ObjectType == "activity" {
		userID, errUser := db.GetUserByAthleteID(c, h.DB, req.OwnerID)
		if errUser != nil {
			return errUser
		}

		token, errToken := db.EnsureValidStravaAccessToken(c, h.DB, userID)
		if errToken != nil {
			return errToken
		}

		activity, errFetch := db.FetchStravaActivityByID(token, strconv.Itoa(int(req.ObjectID)))
		if errFetch != nil {
			return errFetch
		}

		err := db.InsertActivities(c, h.DB, req.OwnerID, activity)
		if err != nil {
			return err
		}

		return nil

	} else if req.AspectType == "update" && req.ObjectType == "activity" {
		var name *string
		var sport *string

		if req.Updates != nil {
			name = req.Updates.Title
			sport = req.Updates.Type
		}

		err := db.UpdateActivityByActivityID(c, h.DB, strconv.FormatInt(req.ObjectID, 10), strconv.FormatInt(req.OwnerID, 10), name, sport)
		if err != nil {
			return err
		}

		return nil

	} else if req.AspectType == "delete" && req.ObjectType == "activity" {
		err := db.DeleteActivityByActivityID(c, h.DB, strconv.Itoa(int(req.ObjectID)), strconv.Itoa(int(req.OwnerID)))
		if err != nil {
			return err
		}

		return nil

	} else if req.AspectType == "update" && req.ObjectType == "athlete" {
		userID, errUser := db.GetUserByAthleteID(c, h.DB, req.OwnerID)
		if errUser != nil {
			return errUser
		}

		errDelete := db.DeleteUserByID(c, h.DB, userID)
		if errDelete != nil {
			return errDelete
		}

		errActivities := db.DeleteActivitiesByAthleteID(c, h.DB, strconv.Itoa(int(req.OwnerID)))
		if errActivities != nil {
			return errActivities
		}

		return nil
	}

	return nil
}

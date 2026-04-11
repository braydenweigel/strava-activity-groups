package handlers

import (
	"net/http"
	"os"
	db "strava-activity-groups/backend/db/lib"
	"strava-activity-groups/backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type StravaHandler struct {
	DB *pgxpool.Pool
}

func NewStravaHandler(db *pgxpool.Pool) *StravaHandler {
	return &StravaHandler{DB: db}
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

	//determine event type
	if req.AspectType == "create" && req.ObjectType == "activity" {

	} else if req.AspectType == "update" && req.ObjectType == "activity" {

	} else if req.AspectType == "delete" && req.ObjectType == "activity" {
		err := db.DeleteActivityByActivityID(c, h.DB, strconv.Itoa(int(req.ObjectID)), strconv.Itoa(int(req.OwnerID)))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "error deleting activity"})
			return
		}

		c.Status(http.StatusOK)
		return

	} else if req.AspectType == "update" && req.ObjectType == "athlete" {
		userID, errUser := db.GetUserByAthleteID(c, h.DB, req.OwnerID)
		if errUser != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		errDelete := db.DeleteUserByID(c, h.DB, userID)
		if errDelete != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error deleting user"})
			return
		}

		errActivities := db.DeleteActivitiesByAthleteID(c, h.DB, strconv.Itoa(int(req.OwnerID)))
		if errActivities != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Error deleting activities"})
			return
		}

		c.Status(http.StatusOK)
		return
	}

	//---activity created
	//-----FetchStravaActivityByID()
	//-----InsertActivities
	//-----c.Status(http.StatusOK)

	//---activity updated
	//-----UpdateActivityByID()
	//-----c.Status(http.StatusOK)

	c.JSON(http.StatusBadRequest, gin.H{"error": "Could not determine event type"})
}

func (h *StravaHandler) StravaWebhooksVerify(c *gin.Context) {

	c.JSON(http.StatusOK, gin.H{"message": "strava webhooks"})
}

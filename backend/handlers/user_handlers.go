package handlers

import (
	"net/http"
	db "strava-activity-groups/backend/db/lib"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserHandler struct {
	DB *pgxpool.Pool
}

func NewUserHandler(db *pgxpool.Pool) *UserHandler {
	return &UserHandler{DB: db}
}

func (h *UserHandler) UserAthlete(c *gin.Context) {
	id, _ := db.GetUserID(c)

	user, err := db.GetUserByID(c, h.DB, id)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	if user == nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	c.JSON(http.StatusOK, user)

}

func (h *UserHandler) UserActivities(c *gin.Context) {
	limit := 25

	var cursorDate *time.Time
	var cursorID *uuid.UUID

	if d := c.Query("cursor_date"); d != "" {
		parsed, err := time.Parse(time.RFC3339, d)
		if err == nil {
			cursorDate = &parsed
		}
	}

	if id := c.Query("cursor_id"); id != "" {
		parsed, err := uuid.Parse(id)
		if err == nil {
			cursorID = &parsed
		}
	}

	//get the user because we need their athlete ID
	userID, _ := db.GetUserID(c)
	user, err := db.GetUserByID(c, h.DB, userID)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	if user == nil {
		c.AbortWithStatus(http.StatusNotFound)
		return
	}

	//get activities
	activities, err := db.GetActivitiesByAthleteIDPaginated(
		c.Request.Context(),
		h.DB,
		user.AthleteID,
		cursorDate,
		cursorID,
		limit,
	)

	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	//request more activities from strava if all activities have been sent to frontend
	if (len(activities) < limit) && (user.AllActivities == false) {
		//fetch activities from strava
		token, err := db.EnsureValidStravaAccessToken(c, h.DB, userID)
		if err != nil {
			print(err.Error())
			c.AbortWithStatus(501)
			return
		}

		newActivities, err := db.FetchMoreStravaActivities(token, *cursorDate)
		if err != nil {
			c.AbortWithStatus(502)
			return
		}

		athleteID, err := strconv.ParseInt(user.AthleteID, 10, 64)
		if err != nil {
			c.AbortWithStatus(503)
			return
		}

		db.InsertActivities(c, h.DB, athleteID, newActivities)

		//re-request activities from db after strava fetch
		activities, err = db.GetActivitiesByAthleteIDPaginated(
			c.Request.Context(),
			h.DB,
			user.AthleteID,
			cursorDate,
			cursorID,
			limit,
		)

		if err != nil {
			c.AbortWithStatus(504)
			return
		}
	}

	//determine next cursor
	var nextCursor *gin.H
	if len(activities) == limit {
		last := activities[len(activities)-1]
		nextCursor = &gin.H{
			"cursor_date": last.Date.Format(time.RFC3339),
			"cursor_id":   last.ID,
		}
	} else if len(activities) > 0 { //last activities available
		last := activities[len(activities)-1]
		nextCursor = &gin.H{
			"cursor_date": last.Date.Format(time.RFC3339),
			"cursor_id":   last.ID,
		}
		//update user.allActivities to true
	} else {
		nextCursor = &gin.H{
			"cursor_date": cursorDate,
			"cursor_id":   cursorID,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"data":        activities,
		"next_cursor": nextCursor,
	})

}

func (h *UserHandler) DeleteProfile(c *gin.Context) {
	c.JSON(http.StatusOK, 1)
}

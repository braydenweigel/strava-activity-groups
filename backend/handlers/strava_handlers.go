package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type StravaHandler struct {
	DB *pgxpool.Pool
}

func NewStravaHandler(db *pgxpool.Pool) *StravaHandler {
	return &StravaHandler{DB: db}
}

func (h *StravaHandler) StravaAthlete(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "strava athlete"})
}

func (h *StravaHandler) StravaActivities(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "strava activities"})
}

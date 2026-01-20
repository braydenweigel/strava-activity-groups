package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserHandler struct {
	DB *pgxpool.Pool
}

func NewUserHandler(db *pgxpool.Pool) *UserHandler {
	return &UserHandler{DB: db}
}

func (h *UserHandler) UserAthlete(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "user athlete"})
}

func (h *UserHandler) UserActivities(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "user activities"})
}

func (h *UserHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, 0)
}

func (h *UserHandler) DeleteProfile(c *gin.Context) {
	c.JSON(http.StatusOK, 1)
}

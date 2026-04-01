package handlers

import (
	db "strava-activity-groups/backend/db/lib"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TagHandler struct {
	DB *pgxpool.Pool
}

func NewTagHandler(db *pgxpool.Pool) *TagHandler {
	return &TagHandler{DB: db}
}

func (h *TagHandler) TagCreate(c *gin.Context) {
	userID, _ := db.GetUserID(c)
	print(userID.String())
}

func (h *TagHandler) TagsGet(c *gin.Context) {
	userID, _ := db.GetUserID(c)
	print(userID.String())
}

func (h *TagHandler) TagUpdate(c *gin.Context) {
	id := c.Query("id")
	print(id)
}

func (h *TagHandler) TagDelete(c *gin.Context) {
	id := c.Query("id")
	print(id)
}

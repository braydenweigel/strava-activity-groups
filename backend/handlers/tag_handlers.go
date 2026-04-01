package handlers

import (
	db "strava-activity-groups/backend/db/lib"

	"strava-activity-groups/backend/models"

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
	var req models.CreateTagRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if userID.String() != req.UserID { //if userID in request body doesn't match the userID from the access token
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	tag, err := db.InsertTag(c, h.DB, req.UserID, req.TagName, req.Parent)

	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, tag)

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

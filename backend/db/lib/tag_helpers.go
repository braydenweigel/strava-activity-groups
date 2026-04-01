package db

import (
	"context"
	"fmt"
	"log"
	"strava-activity-groups/backend/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

func InsertTag(
	ctx context.Context,
	db *pgxpool.Pool,
	userID string,
	tagName string,
	parentID *string,
) (*models.Tag, error) {
	print(parentID)

	if parentID != nil {
		var exists bool
		err := db.QueryRow(ctx, `
			SELECT EXISTS (
				SELECT 1 FROM tags
				WHERE id = $1 AND user_id = $2
			)
		`, *parentID, userID).Scan(&exists)

		if err != nil {
			return nil, err
		}

		if !exists {
			return nil, fmt.Errorf("invalid parent_id")
		}
	}

	var tag models.Tag

	log.Println("Inserting with parentID:", parentID)

	err := db.QueryRow(ctx, `
		INSERT INTO tags (user_id, tagname, parent_id)
		VALUES ($1, $2, $3)
		RETURNING id, user_id, tagname, parent_id
	`, userID, tagName, parentID).Scan(
		&tag.ID,
		&tag.UserID,
		&tag.TagName,
		&tag.ParentID,
	)

	if err != nil {
		return nil, err
	}

	return &tag, nil
}

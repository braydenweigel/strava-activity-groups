package db

import (
	"context"
	"fmt"
	"log"
	"strava-activity-groups/backend/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func InsertTag(
	ctx context.Context,
	db *pgxpool.Pool,
	userID string,
	tagName string,
	parentID *string,
) (*models.Tag, error) {

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

func GetTagsByUserID(
	ctx context.Context,
	db *pgxpool.Pool,
	userID uuid.UUID,
) ([]models.TagWithActivities, error) {
	rows, err := db.Query(ctx, `
		SELECT 
			t.id,
			t.user_id,
			t.tagname,
			t.parent_id,
			COALESCE(array_agg(ta.activity_id) FILTER (WHERE ta.activity_id IS NOT NULL), '{}') AS activities
		FROM tags t
		LEFT JOIN tag_activities ta ON ta.tag_id = t.id
		WHERE t.user_id = $1
		GROUP BY t.id
		ORDER BY t.tagname
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []models.TagWithActivities

	for rows.Next() {
		var t models.TagWithActivities

		err := rows.Scan(
			&t.ID,
			&t.UserID,
			&t.TagName,
			&t.ParentID,
			&t.Activities,
		)
		if err != nil {
			return nil, err
		}

		tags = append(tags, t)
	}

	return tags, rows.Err()

}

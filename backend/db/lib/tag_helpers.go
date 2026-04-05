package db

import (
	"context"
	"encoding/json"
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
			COALESCE(
				json_agg(
					json_build_object(
						'id', ta.id,
						'tag_id', ta.tag_id,
						'user_id', ta.user_id,
						'activity_id', ta.activity_id
					)
				) FILTER (WHERE ta.id IS NOT NULL),
				'[]'
			) AS activities
		FROM tags AS t
		LEFT JOIN tag_activities AS ta ON ta.tag_id = t.id
		WHERE t.user_id = $1
		GROUP BY t.id, t.user_id, t.tagname, t.parent_id
		ORDER BY t.tagname
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []models.TagWithActivities

	for rows.Next() {
		var t models.TagWithActivities
		var activitiesJSON []byte

		err := rows.Scan(
			&t.ID,
			&t.UserID,
			&t.TagName,
			&t.ParentID,
			&activitiesJSON,
		)
		if err != nil {
			return nil, err
		}

		if err := json.Unmarshal(activitiesJSON, &t.Activities); err != nil {
			return nil, err
		}

		tags = append(tags, t)
	}

	return tags, rows.Err()

}

func UpdateTagByID(
	ctx context.Context,
	db *pgxpool.Pool,
	userID uuid.UUID,
	tagID string,
	tagName *string,
	parentID *string,
) (*models.Tag, error) {
	log.Println("Tag ID: ", tagID)

	// 1. Ensure tag exists and belongs to user
	var existingTag models.Tag
	err := db.QueryRow(ctx, `
		SELECT id, user_id, tagname, parent_id
		FROM tags
		WHERE id = $1 AND user_id = $2
	`, tagID, userID).Scan(
		&existingTag.ID,
		&existingTag.UserID,
		&existingTag.TagName,
		&existingTag.ParentID,
	)
	if err != nil {
		return nil, fmt.Errorf("tag not found")
	}

	// 2. Start building query
	query := `UPDATE tags SET `
	args := []interface{}{}
	argPos := 1

	// 3. Update tag name if provided
	if tagName != nil {
		query += fmt.Sprintf("tagname = $%d,", argPos)
		args = append(args, *tagName)
		argPos++
	}

	// 4. Always handle parent (nil = set NULL)
	if parentID == nil {
		// explicitly clear parent
		query += fmt.Sprintf("parent_id = $%d,", argPos)
		args = append(args, nil)
		argPos++
	} else {
		// prevent self-parent
		if *parentID == tagID {
			return nil, fmt.Errorf("tag cannot be its own parent")
		}

		// validate parent exists and belongs to user
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

		// 🔥 cycle check
		var createsCycle bool
		err = db.QueryRow(ctx, `
			WITH RECURSIVE ancestors AS (
				SELECT id, parent_id
				FROM tags
				WHERE id = $1

				UNION ALL

				SELECT t.id, t.parent_id
				FROM tags t
				INNER JOIN ancestors a ON t.id = a.parent_id
			)
			SELECT EXISTS (
				SELECT 1 FROM ancestors WHERE id = $2
			)
		`, *parentID, tagID).Scan(&createsCycle)

		if err != nil {
			return nil, err
		}
		if createsCycle {
			return nil, fmt.Errorf("cannot set parent: would create cycle")
		}

		query += fmt.Sprintf("parent_id = $%d,", argPos)
		args = append(args, *parentID)
		argPos++
	}

	// 5. Ensure something is being updated
	if len(args) == 0 {
		return nil, fmt.Errorf("nothing to update")
	}

	// 6. Remove trailing comma
	query = query[:len(query)-1]

	// 7. Add WHERE + RETURNING
	query += fmt.Sprintf(`
		WHERE id = $%d
		RETURNING id, user_id, tagname, parent_id
	`, argPos)

	args = append(args, tagID)

	// 8. Execute
	var updated models.Tag
	err = db.QueryRow(ctx, query, args...).Scan(
		&updated.ID,
		&updated.UserID,
		&updated.TagName,
		&updated.ParentID,
	)
	if err != nil {
		return nil, err
	}

	return &updated, nil

}

func DeleteTagByID(
	ctx context.Context,
	db *pgxpool.Pool,
	userID uuid.UUID,
	tagID string,
) error {
	// Ensure tag exists and belongs to user
	var exists bool
	err := db.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1 FROM tags
			WHERE id = $1 AND user_id = $2
		)
	`, tagID, userID).Scan(&exists)

	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("tag not found")
	}

	// Recursive delete (tag + all descendants)
	_, err = db.Exec(ctx, `
		WITH RECURSIVE descendants AS (
			SELECT id
			FROM tags
			WHERE id = $1

			UNION ALL

			SELECT t.id
			FROM tags t
			INNER JOIN descendants d ON t.parent_id = d.id
		)
		DELETE FROM tags
		WHERE id IN (SELECT id FROM descendants)
	`, tagID)

	if err != nil {
		return err
	}

	return nil
}

func InsertTagActivity(
	ctx context.Context,
	db *pgxpool.Pool,
	tagID string,
	userID string,
	activityID string,
) (*models.TagActivity, error) {
	var ta models.TagActivity

	err := db.QueryRow(ctx, `
		INSERT INTO tag_activities (tag_id, user_id, activity_id)
		VALUES ($1, $2, $3)
		RETURNING id, tag_id, user_id, activity_id
	`, tagID, userID, activityID).Scan(
		&ta.ID,
		&ta.TagID,
		&ta.UserID,
		&ta.ActivityID,
	)

	if err != nil {
		return nil, err
	}

	return &ta, nil
}

func DeleteTagActivityByID(
	ctx context.Context,
	db *pgxpool.Pool,
	id string,
) error {

	cmdTag, err := db.Exec(ctx, `
		DELETE FROM tag_activities
		WHERE id = $1
	`, id)

	if err != nil {
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		return fmt.Errorf("tag_activity not found")
	}

	return nil
}

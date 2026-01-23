package db

import (
	"context"
	"strava-activity-groups/backend/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func UpsertStravaTokens(
	ctx context.Context,
	db *pgxpool.Pool,
	userID uuid.UUID,
	tokenRes models.TokenResponse,
	scope string,
) (string, error) {
	var accessToken string

	err := db.QueryRow(
		ctx,
		`
		INSERT INTO strava_tokens (
			user_id,
			access_token,
			refresh_token,
			expires_at,
			scope,
			updated_at
		)
		VALUES ($1, $2, $3, to_timestamp($4), $5, now())
		ON CONFLICT (user_id)
		DO UPDATE SET
			access_token  = EXCLUDED.access_token,
			refresh_token = EXCLUDED.refresh_token,
			expires_at    = EXCLUDED.expires_at,
			scope         = EXCLUDED.scope,
			updated_at    = now()
		RETURNING access_token
		`,
		userID,
		tokenRes.AccessToken,
		tokenRes.RefreshToken,
		tokenRes.ExpiresAt,
		scope,
	).Scan(&accessToken)

	return accessToken, err
}

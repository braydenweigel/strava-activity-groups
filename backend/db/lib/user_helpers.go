package db

import (
	"context"
	"strava-activity-groups/backend/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetUserByAthleteID(
	ctx context.Context,
	db *pgxpool.Pool,
	athleteID int64,
) (uuid.UUID, error) {
	var userID uuid.UUID

	err := db.QueryRow(
		ctx,
		`SELECT id FROM users WHERE athlete_id = $1`,
		athleteID,
	).Scan(&userID)

	if err == pgx.ErrNoRows { //user doesn't exist
		return uuid.Nil, nil
	}

	if err != nil { //err querying database
		return uuid.Nil, err
	}

	return userID, nil
}

func CreateUserByAthleteID(
	ctx context.Context,
	db *pgxpool.Pool,
	tokenRes models.TokenResponse,
) (uuid.UUID, error) {
	var userID uuid.UUID

	err := db.QueryRow(
		ctx,
		`
		INSERT INTO users (
			athlete_id,
			firstname,
			lastname,
			username,
			units
		)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (athlete_id)
		DO UPDATE SET
			firstname = EXCLUDED.firstname,
			lastname  = EXCLUDED.lastname,
			username  = EXCLUDED.username,
			units     = EXCLUDED.units
		RETURNING id
		`,
		tokenRes.Athlete.ID,
		tokenRes.Athlete.Firstname,
		tokenRes.Athlete.Lastname,
		tokenRes.Athlete.Username,
		tokenRes.Athlete.Units,
	).Scan(&userID)

	if err != nil { //err querying database
		return uuid.Nil, err
	}

	return userID, nil
}

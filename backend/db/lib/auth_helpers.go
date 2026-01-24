package db

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"os"
	"strava-activity-groups/backend/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GenerateRefreshToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func GetOrCreateRefreshToken(
	ctx context.Context,
	db *pgxpool.Pool,
	userID uuid.UUID,
) (string, error) {
	newToken, err := GenerateRefreshToken()
	if err != nil {
		return "", err
	}

	var token string

	//insert a new token if the user doesn't have one
	err = db.QueryRow(
		ctx,
		`
		INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		SELECT $1, $2, $3
		WHERE NOT EXISTS (
			SELECT 1
			FROM refresh_tokens
			WHERE user_id = $1
			  AND expires_at > now()
		)
		RETURNING token_hash
		`,
		userID,
		newToken,
		time.Now().Add(30*24*time.Hour),
	).Scan(&token)

	//return token if no errors inserting
	if err == nil {
		return token, nil
	}

	//get a token if the user already exists
	if errors.Is(err, pgx.ErrNoRows) {
		err = db.QueryRow(
			ctx,
			`
			SELECT token_hash
			FROM refresh_tokens
			WHERE user_id = $1
			  AND expires_at > now()
			`,
			userID,
		).Scan(&token)

		return token, err
	}

	return "", err
}

func ValidateRefreshToken(
	ctx context.Context,
	db *pgxpool.Pool,
	refreshToken string,
) (uuid.UUID, error) {

	var userID uuid.UUID

	err := db.QueryRow(
		ctx,
		`
		SELECT user_id
		FROM refresh_tokens
		WHERE token_hash = $1
		  AND expires_at > now()
		`,
		refreshToken,
	).Scan(&userID)

	return userID, err
}

func IssueJWT(userID uuid.UUID) (string, error) {
	claims := models.Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "strava-activity-groups",
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(60 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

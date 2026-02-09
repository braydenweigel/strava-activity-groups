package db

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strava-activity-groups/backend/models"
	"strings"
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

func GetStravaToken(
	ctx context.Context,
	db *pgxpool.Pool,
	userID uuid.UUID,
) (*models.StravaToken, error) {

	const query = `
		SELECT
			id,
			user_id,
			access_token,
			refresh_token,
			expires_at,
			scope,
			created_at,
			updated_at
		FROM strava_tokens
		WHERE user_id = $1
	`

	var token models.StravaToken

	err := db.QueryRow(ctx, query, userID).Scan(
		&token.ID,
		&token.UserID,
		&token.AccessToken,
		&token.RefreshToken,
		&token.ExpiresAt,
		&token.Scope,
		&token.CreatedAt,
		&token.UpdatedAt,
	)

	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil // no token yet
		}
		return nil, err
	}

	return &token, nil
}

func RefreshStravaAccessToken(
	ctx context.Context,
	refreshToken string,
) (*models.TokenResponse, error) {

	form := url.Values{
		"client_id":     {os.Getenv("CLIENT_ID")},
		"client_secret": {os.Getenv("CLIENT_SECRET")},
		"grant_type":    {"refresh_token"},
		"refresh_token": {refreshToken},
	}

	req, err := http.NewRequestWithContext(
		ctx,
		"POST",
		"https://www.strava.com/oauth/token",
		strings.NewReader(form.Encode()),
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("strava refresh failed: %s", body)
	}

	var tokenRes models.TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenRes); err != nil {
		return nil, err
	}

	return &tokenRes, nil
}

func EnsureValidStravaAccessToken(
	ctx context.Context,
	db *pgxpool.Pool,
	userID uuid.UUID,
) (string, error) {

	token, err := GetStravaToken(ctx, db, userID)
	if err != nil {
		return "", err
	}

	// still valid (give 1 min buffer)
	if time.Now().Before(token.ExpiresAt.Add(-time.Minute)) {
		return token.AccessToken, nil
	}

	// refresh
	newToken, err := RefreshStravaAccessToken(ctx, token.RefreshToken)
	if err != nil {
		return "", err
	}

	// persist updated token
	_, err = UpsertStravaTokens(ctx, db, userID, *newToken, token.Scope)
	if err != nil {
		return "", err
	}

	return newToken.AccessToken, nil
}

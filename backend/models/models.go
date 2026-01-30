package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type User struct {
	ID            string `db:"id" json:"id"`
	AthleteID     string `db:"athlete_id" json:"athleteID"`
	Firstname     string `db:"firstname" json:"firstname"`
	Lastname      string `db:"lastname" json:"lastname"`
	Username      string `db:"username" json:"username"`
	Units         string `db:"units" json:"units"`
	AllActivities bool   `db:"all_activities" json:"allActivities"`
}

type Activity struct {
	ID          string    `db:"id" json:"id"`
	ActivityID  string    `db:"activity_id" json:"activityID"`
	AthleteID   string    `db:"athlete_id" json:"athleteID"`
	Name        string    `db:"name" json:"name"`
	Distance    *float64  `db:"distance" json:"distance"`
	MovingTime  *int      `db:"moving_time" json:"moving_time"`
	ElapsedTime *int      `db:"elapsed_time" json:"elapsed_time"`
	Elevation   *float64  `db:"elevation" json:"elevation"`
	Sport       string    `db:"sport" json:"sport"`
	Date        time.Time `db:"date" json:"date"`
	DateLocal   time.Time `db:"date_local" json:"date_local"`
	City        *string   `db:"city" json:"city"`
	State       *string   `db:"state" json:"state"`
	Country     *string   `db:"country" json:"country"`
}

type StravaToken struct {
	ID           string    `db:"id" json:"id"`
	UserID       string    `db:"user_id" json:"user_id"`
	AccessToken  string    `db:"access_token" json:"-"`
	RefreshToken string    `db:"refresh_token" json:"-"`
	ExpiresAt    time.Time `db:"expires_at" json:"expires_at"`
	Scope        string    `db:"scope" json:"scope"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
}

type RefreshToken struct {
	ID        string     `db:"id" json:"id"`
	UserID    string     `db:"user_id" json:"user_id"`
	TokenHash string     `db:"token_hash" json:"-"`
	ExpiresAt time.Time  `db:"expires_at" json:"expires_at"`
	CreatedAt time.Time  `db:"created_at" json:"created_at"`
	RevokedAt *time.Time `db:"revoked_at" json:"revoked_at,omitempty"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    int64  `json:"expires_at"`
	Athlete      struct {
		ID        int64  `json:"id"`
		Firstname string `json:"firstname"`
		Lastname  string `json:"lastname"`
		Username  string
		Units     string
	} `json:"athlete"`
}

type Claims struct {
	UserID uuid.UUID `json:"user_id"`
	jwt.RegisteredClaims
}

type StravaActivity struct {
	ID              int64     `json:"id"`
	Name            string    `json:"name"`
	Distance        *float64  `json:"distance"`
	MovingTime      *int      `json:"moving_time"`
	ElapsedTime     *int      `json:"elapsed_time"`
	TotalElevation  *float64  `json:"total_elevation_gain"`
	SportType       string    `json:"sport_type"`
	StartDate       time.Time `json:"start_date"`
	StartDateLocal  time.Time `json:"start_date_local"`
	LocationCity    *string   `json:"location_city"`
	LocationState   *string   `json:"location_state"`
	LocationCountry *string   `json:"location_country"`
}

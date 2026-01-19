package models

import (
	"time"
)

type User struct {
	ID        string `db:"id" json:"id"`
	AthleteID string `db:"athleteID" json:"athleteID"`
	Firstname string `db:"firstname" json:"firstname"`
	Lastname  string `db:"lastname" json:"lastname"`
	Username  string `db:"username" json:"username"`
	Units     string `db:"units" json:"units"`
}

type Activity struct {
	ID          string   `db:"id" json:"id"`
	ActivityID  string   `db:"activityID" json:"activityID"`
	AthleteID   string   `db:"athleteID" json:"athleteID"`
	Name        string   `db:"name" json:"name"`
	Distance    *float64 `db:"distance" json:"distance"`
	MovingTime  *int     `db:"moving_time" json:"moving_time"`
	ElapsedTime *int     `db:"elapsed_time" json:"elapsed_time"`
	Elevation   *float64 `db:"elevation" json:"elevation"`
	Sport       string   `db:"sport" json:"sport"`
	Date        string   `db:"date" json:"date"`
	DateLocal   string   `db:"date_local" json:"date_local"`
	City        *string  `db:"city" json:"city"`
	State       *string  `db:"state" json:"state"`
	Country     *string  `db:"country" json:"country"`
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

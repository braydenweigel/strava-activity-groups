package db

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strava-activity-groups/backend/models"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func InsertActivities(
	ctx context.Context,
	db *pgxpool.Pool,
	athleteID int64,
	activities []models.StravaActivity,
) error {
	batch := &pgx.Batch{}

	for _, a := range activities {
		batch.Queue(
			`
			INSERT INTO activities (
				activity_id,
				athlete_id,
				name,
				distance,
				moving_time,
				elapsed_time,
				elevation,
				average_heartrate,
				sport,
				date,
				date_local,
				city,
				state,
				country
			)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
			ON CONFLICT (activity_id) DO NOTHING
			`,
			a.ID,
			athleteID,
			a.Name,
			a.Distance,
			a.MovingTime,
			a.ElapsedTime,
			a.TotalElevation,
			a.AverageHeartrate,
			a.SportType,
			a.StartDate,
			a.StartDateLocal,
			a.LocationCity,
			a.LocationState,
			a.LocationCountry,
		)
	}

	br := db.SendBatch(ctx, batch)
	defer br.Close()

	for range activities {
		if _, err := br.Exec(); err != nil {
			return err
		}
	}

	return nil

}

func FetchRecentStravaActivities(accessToken string) ([]models.StravaActivity, error) {
	//setup request
	req, err := http.NewRequest(
		"GET",
		"https://www.strava.com/api/v3/athlete/activities?per_page=200&page=1",
		nil,
	)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	//send request and check for errors
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("strava api error: %s", body)
	}

	//parse json response
	var activities []models.StravaActivity
	if err := json.NewDecoder(resp.Body).Decode(&activities); err != nil {
		return nil, err
	}

	return activities, err
}

func FetchMoreStravaActivities(accessToken string, before time.Time) ([]models.StravaActivity, error) {
	req, err := http.NewRequest(
		"GET",
		`https://www.strava.com/api/v3/athlete/activities`,
		nil,
	)
	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	q.Set("before", strconv.FormatInt(before.Unix(), 10))
	q.Set("per_page", "200")

	req.URL.RawQuery = q.Encode()

	req.Header.Set("Authorization", "Bearer "+accessToken)

	//send request and check for errors
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("strava api error: %s", body)
	}

	//parse json response
	var activities []models.StravaActivity
	if err := json.NewDecoder(resp.Body).Decode(&activities); err != nil {
		return nil, err
	}

	return activities, err

}

func GetActivitiesByAthleteIDPaginated(
	ctx context.Context,
	db *pgxpool.Pool,
	athleteID string,
	cursorDate *time.Time,
	cursorID *uuid.UUID,
	limit int,
) ([]models.Activity, error) {

	const baseQuery = `
		SELECT
			id,
			activity_id,
			athlete_id,
			name,
			distance,
			moving_time,
			elapsed_time,
			elevation,
			average_heartrate,
			sport,
			date,
			date_local,
			city,
			state,
			country
		FROM activities
		WHERE athlete_id = $1
	`

	var (
		rows pgx.Rows
		err  error
	)

	if cursorDate != nil && cursorID != nil {
		query := baseQuery + `
			AND (date, id) < ($2, $3)
			ORDER BY date DESC, id DESC
			LIMIT $4
		`
		rows, err = db.Query(
			ctx,
			query,
			athleteID,
			*cursorDate,
			*cursorID,
			limit,
		)
	} else {
		query := baseQuery + `
			ORDER BY date DESC, id DESC
			LIMIT $2
		`
		rows, err = db.Query(ctx, query, athleteID, limit)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	activities := []models.Activity{}

	for rows.Next() {
		var a models.Activity
		if err := rows.Scan(
			&a.ID,
			&a.ActivityID,
			&a.AthleteID,
			&a.Name,
			&a.Distance,
			&a.MovingTime,
			&a.ElapsedTime,
			&a.Elevation,
			&a.AverageHeartrate,
			&a.Sport,
			&a.Date,
			&a.DateLocal,
			&a.City,
			&a.State,
			&a.Country,
		); err != nil {
			return nil, err
		}
		activities = append(activities, a)
	}

	return activities, rows.Err()
}

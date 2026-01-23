package db

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strava-activity-groups/backend/models"
	"time"

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
				sport,
				date,
				date_local,
				city,
				state,
				country
			)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
			ON CONFLICT (activity_id) DO NOTHING
			`,
			a.ID,
			athleteID,
			a.Name,
			a.Distance,
			a.MovingTime,
			a.ElapsedTime,
			a.TotalElevation,
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

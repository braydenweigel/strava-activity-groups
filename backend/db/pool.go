package db

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupPool(ctx context.Context) (*pgxpool.Pool, error) {

	dbUrl := "postgres://" +
		os.Getenv("POSTGRES_USER") + ":" +
		os.Getenv("POSTGRES_PASSWORD") + "@localhost:" +
		os.Getenv("POSTGRES_PORT") + "/" +
		os.Getenv("POSTGRES_DB") + "?sslmode=disable"

	config, err := pgxpool.ParseConfig(dbUrl)
	if err != nil {
		return nil, err
	}

	config.MaxConns = 10

	return pgxpool.NewWithConfig(ctx, config)
}

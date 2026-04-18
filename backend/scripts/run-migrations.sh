#!/bin/sh
set -e

echo "=== DEBUG START ==="
echo "pwd:"
pwd

echo "listing /app:"
ls -la /app

echo "listing migrations:"
ls -la /app/db/migrations || echo "FAILED TO LIST MIGRATIONS"

echo "=== WAIT FOR POSTGRES ==="
until nc -z postgres 5432; do
  echo "waiting for postgres..."
  sleep 2
done

echo "=== RUNNING MIGRATE ==="

migrate -path /app/db/migrations \
  -database "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres:5432/$POSTGRES_DB?sslmode=disable" \
  up

echo "=== DONE ==="
# build stage
FROM golang:1.25 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o api ./cmd/api
RUN go build -o worker ./cmd/worker

RUN go install -tags 'postgres file' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# runtime stage
FROM debian:bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/api .
COPY --from=builder /app/worker .

COPY --from=builder /go/bin/migrate /usr/local/bin/migrate

COPY --from=builder /app/db/migrations ./db/migrations

COPY scripts/run-migrations.sh /app/run-migrations.sh
RUN chmod +x /app/run-migrations.sh

EXPOSE 8080

CMD ["./api"]
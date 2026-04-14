<img src="/frontend/web-app/src/app/icon.png" alt="Strava Activity Groups Icon" width="100" height="100">.  
# Strava Activity Groups
Add custom tags to your Strava activities.  

## About
### Tech Stack
#### Backend:  
- Go
- Gin Web Framework
- PostgreSQL
- Redis
- Docker

#### Frontend:  
- Next.js
- React
- Typescript
- Tailwind CSS



## Running the app locally
### Backend
1. Navigate to the backend directory
```bash
cd backend
```
2. Set up environment variables. 
    1. Create a .env file, and copy the contents of .env.template. 
    2. Add values for the **POSTGRES_** variables. **POSTGRES_PORT** should be **5432**. If using another port, **docker-compose.yml** needs to be changed.  
    3. Add value for **REDIS_PORT**, should be **6379**. If using another port, **docker-compose.yml** needs to be changed.  
    4. Add values for the Strava variables. 
        - CLIENT_ID and CLIENT_SECRET can be found at https://www.strava.com/settings/api (Visit https://www.strava.com/settings/api if you have not set up a Strava API Application)
        - SUBSCRIPTION_ID is a strava webhooks subscription id. Setting up webhooks can be found at https://developers.strava.com/docs/webhooks/. This is also where you set VERIFY_TOKEN.  
    5. JWT_SECRET is used for generating JWT tokens. Set this to some random string of characters.  
    6. FRONTEND_WEB_URL is the URL of the web app. By default this is http://localhost:3000, but if the web app is running on a different port, make sure FRONTEND_WEB_URL uses that one.  
    7. FRONTEND_MOBILE_URL is the URL of a mobile app. This app has not been created yet, so you don't need to do anything.  

3. Start the Postgres Database and Redis
```bash
docker compose up -d
```
4. Start the API
```bash
go run ./cmd/api
```
5. Start the Redis Worker
```bash
go run ./cmd/worker
```

### Frontend
#### Web App
1. Navigate to the web app directory
```bash
cd frontend/web-app
```
2. Set up environment variable.  
    1. Create a .env file, and copy the contents of .env.template. 
    2. Set value of NEXT_PUBLIC_API_URL to the URL of the API. This should be http://localhost:8080. 
3. Run a dev build of the web app
```bash
npm run dev
```

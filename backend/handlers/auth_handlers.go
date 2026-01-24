package handlers

import (
	"encoding/json"
	"net/http"
	"net/url"
	"os"
	db "strava-activity-groups/backend/db/lib"
	"strava-activity-groups/backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthHandler struct {
	DB *pgxpool.Pool
}

func NewAuthHandler(db *pgxpool.Pool) *AuthHandler {
	return &AuthHandler{DB: db}
}

func (h *AuthHandler) Refresh(c *gin.Context) {

	//get refresh token from cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	//validate refresh token
	userID, err := db.ValidateRefreshToken(c.Request.Context(), h.DB, refreshToken)
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	//issue new JWT
	jwtToken, err := db.IssueJWT(userID)
	if err != nil {
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": jwtToken,
	})
}

func (h *AuthHandler) StravaCallback(c *gin.Context) {
	//check scope param
	scope := c.Query("scope")
	if scope != "read,activity:read_all" {
		c.Redirect(http.StatusFound, "http://localhost:3000?error=invalid_scope") //link will be different for mobile
	}

	code := c.Query("code")
	_ = c.Query("state") //use this when handling both web and mobile redirects

	//send request to Strava API to get the access token
	res, err := http.PostForm(
		"https://www.strava.com/oauth/token",
		url.Values{
			"client_id":     {os.Getenv("CLIENT_ID")},
			"client_secret": {os.Getenv("CLIENT_SECRET")},
			"code":          {code},
			"grant_type":    {"authorization_code"},
		},
	)
	if err != nil {
		c.Redirect(http.StatusFound, "http://localhost:3000?error=failed_token_error")
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		c.Redirect(http.StatusFound, "http://localhost:3000?error=failed_token_status")
	}

	var tokenRes models.TokenResponse
	tokenRes.Athlete.Username = ""
	tokenRes.Athlete.Units = "mi"

	if err := json.NewDecoder(res.Body).Decode(&tokenRes); err != nil {
		c.Redirect(http.StatusFound, "http://localhost:3000?error=failed_decode")
	}

	//check if user exists already
	userID, err := db.GetUserByAthleteID(c, h.DB, tokenRes.Athlete.ID)

	//if user doesn't exist, create new user
	if userID == uuid.Nil {
		userID, err = db.CreateUserByAthleteID(c, h.DB, tokenRes)
		if userID == uuid.Nil {
			c.Redirect(http.StatusFound, "http://localhost:3000?error=failed_user_creation")
		}
	}

	//create or update strava_tokens row
	accessToken, err := db.UpsertStravaTokens(c, h.DB, userID, tokenRes, scope)
	if err != nil {
		c.Redirect(http.StatusFound, "http://localhost:3000?error=failed_token_insert")
	}

	//request activities to add to DB. Activities already present should not be inserted
	activities, err := db.FetchRecentStravaActivities(accessToken)
	db.InsertActivities(c, h.DB, tokenRes.Athlete.ID, activities)

	//create new refresh_tokens
	refreshToken, err := db.GetOrCreateRefreshToken(c, h.DB, userID)
	if err != nil {
		c.Redirect(http.StatusFound, "http://localhost:3000?error="+err.Error())
	}

	//send back redirect link and refresh token hash in secure cookies
	c.SetCookie(
		"refresh_token",
		refreshToken,
		60*60*24*90, //expires in 90 days
		"/",
		"",
		true, // secure (true in prod)
		true, // httpOnly
	)

	c.Redirect(http.StatusFound, "http://localhost:3000?login=success")
}

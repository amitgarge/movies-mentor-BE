# Movie Mentor Backend

Movie Mentor Backend is the Node.js API layer for the Movie Mentor UI. It keeps TMDB and OpenAI credentials on the server, proxies movie data from TMDB, and powers AI-assisted movie recommendation search for the React frontend.

## Features

- Express API server
- Health check endpoint
- TMDB movie list proxy endpoints
- TMDB trailer lookup endpoint
- AI-assisted recommendations through OpenAI
- Structured movie discovery for queries like `latest hindi action movies`
- Query validation and adult-content blocking
- Centralized error handling
- CORS support for the frontend app

## Tech Stack

- Node.js
- Express 5
- dotenv
- cors
- TMDB API
- OpenAI Chat Completions API

## Prerequisites

- Node.js
- npm
- TMDB v4 access token
- OpenAI API key

## Environment Variables

Create a `.env` file in the backend project root:

```env
PORT=3001
HOST=127.0.0.1
CORS_ORIGIN=http://localhost:3000
TMDB_ACCESS_TOKEN=your_tmdb_v4_access_token
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
TMDB_API_BASE_URL=https://api.themoviedb.org/3
OPENAI_CHAT_COMPLETIONS_URL=https://api.openai.com/v1/chat/completions
```

Supported aliases:

- `TMDB_KEY` or `REACT_APP_TMDB_KEY` can be used instead of `TMDB_ACCESS_TOKEN`
- `OPEN_AI_KEY` or `REACT_APP_OPEN_AI_KEY` can be used instead of `OPENAI_API_KEY`

Prefer the backend names for new setup.

`TMDB_API_BASE_URL` and `OPENAI_CHAT_COMPLETIONS_URL` have safe defaults in code. Set them only when you need to override the upstream API URLs for a different environment.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Start in watch mode:

```bash
npm run dev
```

The API runs at:

```txt
http://127.0.0.1:3001
```

## Available Scripts

```bash
npm start
```

Runs the API server.

```bash
npm run dev
```

Runs the API server with Node watch mode.

```bash
npm test
```

Runs Node's test runner.

## API Endpoints

### Health

```txt
GET /
GET /health
```

### Movie Lists

```txt
GET /api/movies/now-playing
GET /api/movies/popular
GET /api/movies/top-rated
GET /api/movies/upcoming
```

Response:

```json
{
  "results": []
}
```

### Movie Search

```txt
GET /api/movies/search?query=avatar
```

Response:

```json
{
  "results": []
}
```

### Movie Discovery

```txt
GET /api/movies/discover?query=latest%20hindi%20action
```

Response:

```json
{
  "results": []
}
```

### Trailer

```txt
GET /api/movies/:movieId/trailer
```

Response:

```json
{
  "result": {
    "key": "youtube_video_key",
    "site": "YouTube",
    "type": "Trailer"
  }
}
```

### Recommendations

```txt
POST /api/recommend
Content-Type: application/json
```

Request:

```json
{
  "query": "feel good comedy movies"
}
```

Response:

```json
{
  "movieNames": ["Movie One", "Movie Two"],
  "movieResults": [[], []],
  "source": "openai-tmdb"
}
```

Possible `source` values:

- `tmdb-discover`
- `openai`
- `openai-tmdb`

## Project Structure

```txt
src/
  app.js                 Express app setup
  config/                Environment configuration
  controllers/           Request handlers
  middleware/            Error and not-found handlers
  routes/                API route definitions
  services/              TMDB, OpenAI, and recommendation logic
  utils/                 Query parsing and search validation helpers
```

## Frontend Integration

Set this in the React frontend `.env`:

```env
REACT_APP_BACKEND_URL=http://127.0.0.1:3001
```

Then start both apps:

```bash
# Backend
npm start

# Frontend
npm start
```

## Notes

- Keep `.env` out of git.
- Use a TMDB v4 bearer token for `TMDB_ACCESS_TOKEN`.
- The backend filters adult TMDB results and validates unsafe or meaningless search input before making external requests.

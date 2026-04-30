import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 3001,
  host: process.env.HOST || "127.0.0.1",
  tmdbAccessToken:
    process.env.TMDB_ACCESS_TOKEN ||
    process.env.TMDB_KEY ||
    process.env.REACT_APP_TMDB_KEY,
  openAiApiKey:
    process.env.OPENAI_API_KEY ||
    process.env.OPEN_AI_KEY ||
    process.env.REACT_APP_OPEN_AI_KEY,
  openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
};

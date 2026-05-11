import dotenv from "dotenv";

const nodeEnv = process.env.NODE_ENV || "development";

dotenv.config({ path: `.env.${nodeEnv}` });
dotenv.config();

export const env = {
  nodeEnv,
  port: process.env.PORT || 3001,
  host: process.env.HOST || "127.0.0.1",
  tmdbAccessToken:
    process.env.TMDB_ACCESS_TOKEN ||
    process.env.TMDB_KEY ||
    process.env.REACT_APP_TMDB_KEY,
  openAiApiKey:
    process.env.OPENAI_API_KEY ||
    process.env.OPENAI_KEY ||
    process.env.OPEN_AI_KEY ||
    process.env.REACT_APP_OPEN_AI_KEY,
  openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
};

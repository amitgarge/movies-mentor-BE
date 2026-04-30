import { env } from "../config/env.js";
import { filterValidTMDBMovies } from "../utils/searchGuards.js";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

const requestTMDB = async (path, params = {}) => {
  if (!env.tmdbAccessToken) {
    const error = new Error("TMDB_ACCESS_TOKEN is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const url = new URL(`${TMDB_API_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${env.tmdbAccessToken}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data?.status_message || "TMDB request failed.");
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

const currentDate = () => new Date().toISOString().split("T")[0];

export const searchMovies = async (query, { page = 1 } = {}) => {
  const data = await requestTMDB("/search/movie", {
    query,
    include_adult: false,
    language: "en-US",
    page,
  });

  return filterValidTMDBMovies(data.results);
};

export const discoverMovies = async ({
  year,
  isHindi,
  isLatest,
  genreId,
} = {}) => {
  const data = await requestTMDB("/discover/movie", {
    primary_release_year: year,
    with_original_language: isHindi ? "hi" : undefined,
    with_genres: genreId,
    "release_date.lte": currentDate(),
    sort_by: isLatest ? "release_date.desc" : "popularity.desc",
    include_adult: false,
    language: "en-US",
    page: 1,
  });

  return filterValidTMDBMovies(data.results);
};

export const getNowPlayingMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/movie/now_playing", { page, language: "en-US" });
  return filterValidTMDBMovies(data.results);
};

export const getPopularMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/movie/popular", { page, language: "en-US" });
  return filterValidTMDBMovies(data.results);
};

export const getTopRatedMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/movie/top_rated", { page, language: "en-US" });
  return filterValidTMDBMovies(data.results);
};

export const getUpcomingMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/movie/upcoming", { page, language: "en-US" });
  return filterValidTMDBMovies(data.results);
};

export const getMovieTrailer = async (movieId) => {
  const data = await requestTMDB(`/movie/${movieId}/videos`, { language: "en-US" });
  const videos = data.results || [];

  return (
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official === true,
    ) ||
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
    videos.find((video) => video.site === "YouTube") ||
    null
  );
};

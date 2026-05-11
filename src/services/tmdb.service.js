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

const dateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

const safeDiscoverParams = {
  certification_country: "US",
  "certification.lte": "PG-13",
  include_adult: false,
  language: "en-US",
};

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
  isIndian,
  isLatest,
  genreId,
} = {}) => {
  const data = await requestTMDB("/discover/movie", {
    include_adult: false,
    language: "en-US",
    primary_release_year: year,
    with_original_language: isHindi ? "hi" : undefined,
    with_origin_country: isIndian ? "IN" : undefined,
    region: isIndian ? "IN" : undefined,
    with_genres: genreId,
    "release_date.lte": currentDate(),
    sort_by: isLatest ? "release_date.desc" : "popularity.desc",
    page: 1,
  });

  return filterValidTMDBMovies(data.results, {
    originCountry: isIndian ? "IN" : undefined,
    originalLanguage: isHindi ? "hi" : undefined,
  });
};

export const getNowPlayingMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/discover/movie", {
    ...safeDiscoverParams,
    "primary_release_date.gte": dateDaysAgo(60),
    "primary_release_date.lte": currentDate(),
    sort_by: "popularity.desc",
    page,
  });

  return filterValidTMDBMovies(data.results);
};

export const getPopularMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/discover/movie", {
    ...safeDiscoverParams,
    "release_date.lte": currentDate(),
    sort_by: "popularity.desc",
    page,
  });

  return filterValidTMDBMovies(data.results);
};

export const getTopRatedMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/discover/movie", {
    ...safeDiscoverParams,
    "release_date.lte": currentDate(),
    "vote_count.gte": 300,
    sort_by: "vote_average.desc",
    page,
  });

  return filterValidTMDBMovies(data.results);
};

export const getUpcomingMovies = async ({ page = 1 } = {}) => {
  const data = await requestTMDB("/discover/movie", {
    ...safeDiscoverParams,
    "primary_release_date.gte": currentDate(),
    sort_by: "popularity.desc",
    page,
  });

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

import { getMovieNamesFromAI } from "./openai.service.js";
import { discoverMovies, searchMovies } from "./tmdb.service.js";
import { parseDiscoverQuery } from "../utils/queryParser.js";
import {
  filterValidTMDBMovies,
  parseMovieNamesFromAIResponse,
} from "../utils/searchGuards.js";

export const getRecommendedMovies = async (query) => {
  const parsedQuery = parseDiscoverQuery(query);

  if (
    parsedQuery.year ||
    parsedQuery.isHindi ||
    parsedQuery.isIndian ||
    parsedQuery.isLatest ||
    parsedQuery.genreId
  ) {
    const movies = await discoverMovies(parsedQuery);

    return {
      movieNames: [query],
      movieResults: [movies],
      source: "tmdb-discover",
    };
  }

  const aiResponse = await getMovieNamesFromAI(query);
  const movieNames = parseMovieNamesFromAIResponse(aiResponse);

  if (movieNames.length === 0) {
    return {
      movieNames: [],
      movieResults: [],
      source: "openai",
    };
  }

  const tmdbResults = await Promise.all(
    movieNames.map((movieName) => searchMovies(movieName)),
  );

  const validGroups = movieNames.reduce(
    (acc, movieName, index) => {
      const results = filterValidTMDBMovies(tmdbResults[index]);

      if (results.length > 0) {
        acc.movieNames.push(movieName);
        acc.movieResults.push(results);
      }

      return acc;
    },
    { movieNames: [], movieResults: [] },
  );

  return {
    ...validGroups,
    source: "openai-tmdb",
  };
};

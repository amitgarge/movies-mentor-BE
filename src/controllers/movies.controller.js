import {
  discoverMovies,
  getMovieTrailer,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  searchMovies,
} from "../services/tmdb.service.js";
import { parseDiscoverQuery } from "../utils/queryParser.js";
import { isMovieQuery } from "../utils/searchGuards.js";

export const getMovieList = async (req, res, next) => {
  try {
    const listType = req.params.listType;
    const page = req.query.page;

    const handlers = {
      "now-playing": getNowPlayingMovies,
      popular: getPopularMovies,
      "top-rated": getTopRatedMovies,
      upcoming: getUpcomingMovies,
    };

    const handler = handlers[listType];

    if (!handler) {
      return res.status(400).json({
        message:
          "Invalid list type. Use now-playing, popular, top-rated, or upcoming.",
      });
    }

    const movies = await handler({ page });
    res.json({ results: movies });
  } catch (error) {
    next(error);
  }
};

export const searchMovieByTitle = async (req, res, next) => {
  try {
    const query = String(req.query.query || "").trim();
    const page = req.query.page;

    if (!isMovieQuery(query)) {
      return res.status(400).json({ message: "Please enter a valid movie name." });
    }

    const movies = await searchMovies(query, { page });
    res.json({ results: movies });
  } catch (error) {
    next(error);
  }
};

export const discoverMovieResults = async (req, res, next) => {
  try {
    const parsedQuery = parseDiscoverQuery(String(req.query.query || ""));
    const movies = await discoverMovies(parsedQuery);

    res.json({ results: movies });
  } catch (error) {
    next(error);
  }
};

export const getTrailer = async (req, res, next) => {
  try {
    const trailer = await getMovieTrailer(req.params.movieId);
    res.json({ result: trailer });
  } catch (error) {
    next(error);
  }
};

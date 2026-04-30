import { getRecommendedMovies } from "../services/recommendation.service.js";
import {
  hasAdultContentIntent,
  isMovieQuery,
} from "../utils/searchGuards.js";

export const recommendMovies = async (req, res, next) => {
  try {
    const query = String(req.body?.query || "").trim();

    if (!isMovieQuery(query)) {
      return res.status(400).json({
        code: hasAdultContentIntent(query) ? "ADULT_CONTENT" : "INVALID_QUERY",
        message: hasAdultContentIntent(query)
          ? "Adult content searches are not allowed."
          : "Please enter a valid movie query.",
      });
    }

    const recommendations = await getRecommendedMovies(query);
    res.json(recommendations);
  } catch (error) {
    next(error);
  }
};

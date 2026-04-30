import { Router } from "express";
import {
  discoverMovieResults,
  getMovieList,
  getTrailer,
  searchMovieByTitle,
} from "../controllers/movies.controller.js";

const router = Router();

router.get("/search", searchMovieByTitle);
router.get("/discover", discoverMovieResults);
router.get("/:listType", getMovieList);
router.get("/:movieId/trailer", getTrailer);

export default router;

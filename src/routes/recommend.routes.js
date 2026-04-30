import { Router } from "express";
import { recommendMovies } from "../controllers/recommend.controller.js";

const router = Router();

router.post("/", recommendMovies);

export default router;

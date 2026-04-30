import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("MoviesMentor Backend is running");
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;

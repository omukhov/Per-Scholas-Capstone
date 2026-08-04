import express from "express";
import discoverCompanies from "../services/adzuna.js";
import { discoverJobsFromJooble } from "../services/jooble.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await discoverCompanies();
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

router.get("/rem", async (req, res) => {
  try {
    const jobs = await discoverJobsFromJooble();
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

export default router;

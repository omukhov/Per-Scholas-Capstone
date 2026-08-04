import express from "express";
import getCompaniesWithJuniorJobs from "../services/adzuna.js";

const router = express.Router();

router.get("/", async (req, res) => {
  console.log("Route hit!");
  try {
    const jobs = await getCompaniesWithJuniorJobs();
    console.log(jobs);
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

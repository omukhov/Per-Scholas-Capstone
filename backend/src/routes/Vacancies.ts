import express from "express";
import discoverCompaniesFromAdzuna from "../services/adzuna.js";
import discoverCompaniesFromJooble from "../services/jooble.js";
import discoverJobsFromMuse from "../services/muse.js";
import fetchGithubInternships from "../services/internships.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await discoverCompaniesFromAdzuna();
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: errorMessage });
  }
});

// router.get("/rem", async (req, res) => {
//   try {
//     const jobs = await discoverCompaniesFromJooble();
//     res.json({ count: jobs.length, jobs });
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : "Unknown error";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// router.get("/muse", async (req, res) => {
//   try {
//     const jobs = await discoverJobsFromMuse();
//     res.json({ count: jobs.length, jobs });
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : "Unknown error";
//     res.status(500).json({ error: errorMessage });
//   }
// });

// router.get("/int", async (req, res) => {
//   try {
//     const jobs = await fetchGithubInternships();
//     console.log(jobs);
//     res.json({ count: jobs.length, jobs });
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : "Unknown error";
//     res.status(500).json({ error: errorMessage });
//   }
// });

export default router;

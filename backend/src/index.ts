import dotenv from "dotenv";
dotenv.config();

import express from "express";
import jobs from "./routes/jobsRoutes.js";
import companies from "./routes/companiesRoutes.js";
import connectDB from "./config/db.js";
import cron from "node-cron";
import runFullDiscovery from "./services/aggregatorRunner.js";
import runKalilImport from "./services/kalilRunner.js";
import runAtsHarvester from "./services/atsHarvester.js";
import cors from "cors";
import home from "./routes/homeRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/static", express.static("public"));

app.use("/jobs", jobs);
app.use("/companies", companies);

app.get("/", home);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    /* Get jobs from Adzuna, Muse, Jooble API every sunday 03:00 am */
    cron.schedule("0 3 * * 0", async () => {
      console.log("[Cron] Starting scheduled job pipeline...");
      try {
        await runFullDiscovery();
        console.log("[Cron] Scheduled completed successfully!");
      } catch (error) {
        console.error("Cron Error]:", error);
      }
    });

    /* Get jobs from github
     * (https://github.com/kalil0321/ats-scrapers/tree/main/ats-companies)
     * 1 day in every month 02:00 am
     */
    cron.schedule("0 2 1 * *", async () => {
      console.log("[Cron] Starting monthly Kalil import...");

      await runKalilImport();
    });

    /*
     * Process next 100 ATS companies.
     * Every 2 hours.
     */
    cron.schedule("0 */2 * * *", async () => {
      console.log("[Cron] Starting ATS harvesting batch...");

      try {
        await runAtsHarvester();

        console.log("[Cron] ATS harvesting completed successfully!");
      } catch (error: unknown) {
        console.error(
          "[Cron] ATS harvesting failed:",
          error instanceof Error ? error.message : error,
        );
      }
    });
  });
});

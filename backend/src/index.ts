import dotenv from "dotenv";
dotenv.config();

import express from "express";
import vacancies from "./routes/Vacancies.js";
import connectDB from "./config/db.js";
import cron from "node-cron";
import runFullDiscovery from "./services/discoveryRunner.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/static", express.static("public"));

app.use("/vacancies", vacancies);

app.get("/", (req, res) => {
  res.json("main");
});

app.get("/api/admin/trigger-discovery", async (req, res) => {
  try {
    runFullDiscovery();
    res.json({
      message: "Discovery pipeline triggered successfully in background!",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger discovery" });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    cron.schedule("0 3 * * *", async () => {
      console.log("[Cron] Starting scheduled job discovery pipeline...");
      try {
        await runFullDiscovery();
        console.log("[Cron] Scheduled discovery completed successfully!");
      } catch (error) {
        console.error("Cron Error]:", error);
      }
    });
  });
});

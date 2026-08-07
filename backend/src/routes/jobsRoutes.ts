import express from "express";
import { getJobs } from "../controllers/jobsController.js";
import { getJobById } from "../controllers/jobByIdController.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);

export default router;

import express from "express";
import { getJobById } from "../controllers/jobByIdController.js";

const router = express.Router();

router.get("/", getJobById);

export default router;

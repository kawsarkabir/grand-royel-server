import { getStats } from "../controllers/stats.js";
import express from "express";
const router = express.Router();
router.get("/", getStats);
export default router;

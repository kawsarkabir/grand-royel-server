import express from "express";
import { getAllRooms, getRoomById } from "../controllers/room.js";
const router = express.Router();
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
export default router;

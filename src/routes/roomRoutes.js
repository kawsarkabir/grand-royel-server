import express from "express";
import { getAllRooms, getRoomById } from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getAllRooms);
// GET a single room
router.get("/:id", getRoomById);

export default router;

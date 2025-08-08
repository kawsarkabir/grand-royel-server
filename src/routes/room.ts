import express from "express";
import { addRoom, deleteRoom, getAllRooms, getRoomById } from "../controllers/room.js";

const router = express.Router();
router.post("/", addRoom);
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.delete("/:id", deleteRoom);


export default router;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.js";
import roomRoutes from "./src/routes/room.js";
import bookingRoutes from "./src/routes/booking.js";
import reviewRoutes from "./src/routes/review.js";

dotenv.config();

const app = express();

// Middleware 
app.use(cors());
app.use(express.json());
const apiVersion = process.env.API_VERSION;

// Routes
app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/rooms`, roomRoutes);
app.use(`/api/${apiVersion}/bookings`, bookingRoutes);
app.use(`/api/${apiVersion}/reviews`, reviewRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Hotel Booking API is running");
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

export default app;

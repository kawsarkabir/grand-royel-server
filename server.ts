import app from "./app.js";
import connectDB from "./src/config/db.js";

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

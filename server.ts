import app from "./app";
import connectDB from "./src/config/db";

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

// Export app for Vercel serverless
export default app;

import express from "express";
import cors from "cors"; // Import the CORS middleware
import articleRoutes from "./routes/articleRoutes.js"; // Import your article routes

const app = express();

// Middleware to enable CORS
app.use(cors());

// Routes for scraping and getting article data
app.use("/api/articles", articleRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

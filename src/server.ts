import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { Pool } from "pg";

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Enable CORS with specific origin for production
// Replace with your frontend URL or use environment variable for flexibility
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN ||
      "https://greek-learning-game-ts.vercel.app" ||
      "localhost:3000" ||
      "localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON bodies (if needed for POST/PUT requests in the future)
app.use(express.json());

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined, // Required for Neon on Vercel
});

// Types for static data
interface User {
  id: number;
  name: string;
  role: string;
}

interface SampleData {
  message: string;
  data: User[];
}

// Static sample data
const sampleData: SampleData = {
  message: "Welcome to my Express app on Vercel!",
  data: [
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "Designer" },
  ],
};

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Subscribe to Arpan Neupane's channel");
});

app.get("/testdata", (req: Request, res: Response) => {
  res.json(sampleData);
});

app.get("/dbtest", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ success: true, timestamp: rows[0].now });
  } catch (error) {
    console.error("Error in /dbtest:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get("/users", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT id, email, name FROM users");
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error("Error in /users:", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start server only when running locally (not on Vercel serverless)
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `CORS Origin: ${
        process.env.CORS_ORIGIN || "https://greek-learning-game-ts.vercel.app"
      }`
    );
    console.log(
      `Database URL: ${process.env.DATABASE_URL ? "Set" : "Not Set"}`
    );
  });
}

export default app;

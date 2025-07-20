import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors"; // Import CORS
import { Pool } from "pg";

const app = express();
const port = process.env.PORT || 8080;

// Enable CORS for all origins (or specify your frontend origin)
app.use(cors()); // This allows requests from any origin

// Alternatively, restrict to your frontend origin
// app.use(cors({
//   origin: "https://greek-learning-game-m1s1d30f5-yourijanssens-projects.vercel.app"
// }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface User {
  id: number;
  name: string;
  role: string;
}

interface SampleData {
  message: string;
  data: User[];
}

const sampleData: SampleData = {
  message: "Welcome to my Express app on Vercel!",
  data: [
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "Designer" },
  ],
};

app.get("/", (req: Request, res: Response) => {
  res.send("Subscribe to Arpan Neupane's channel");
});

app.get("/testdata", (req: Request, res: Response) => {
  res.json(sampleData);
});

app.get("/users", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT id, email, name FROM users");
    res.json({ success: true, users: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get("/dbtest", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ success: true, timestamp: rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Listen only in local dev. On Vercel, the 'handler' is exported for serverless.
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

export default app;

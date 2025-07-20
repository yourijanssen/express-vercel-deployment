import express, { Request, Response } from "express";
import { Pool } from "pg";

const app = express();
const port = process.env.PORT || 8080;

interface User {
  id: number;
  name: string;
  role: string;
}

interface SampleData {
  message: string;
  data: User[];
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sampleData: SampleData = {
  message: "Welcome to my Express app on Vercel!",
  data: [
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "Designer" },
  ],
};

app.get("/dbtest", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ success: true, timestamp: rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get(
  "/https://express-vercel-deployment-ashen.vercel.app/users",
  async (_req: Request, res: Response) => {
    try {
      const { rows } = await pool.query("SELECT id, email, name FROM users"); // adjust table name if needed
      res.json({ success: true, users: rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
);

app.get("/", (req: Request, res: Response) => {
  res.send("Subscribe to Arpan Neupane's channel");
});

app.get("/testdata", (req: Request, res: Response) => {
  res.json(sampleData);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;

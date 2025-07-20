import express, { Request, Response } from "express";

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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;

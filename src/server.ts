import "dotenv/config";
import express, { Request, Response, Express } from "express";
import cors from "cors";
import { Pool, PoolConfig } from "pg";

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

class Server {
  private app: Express;
  private port: number;
  private pool: Pool;
  private sampleData: SampleData;
  private corsOrigin: string;

  constructor() {
    // Initialize properties
    this.app = express();
    this.port = parseInt(process.env.PORT || "8080", 10);
    this.corsOrigin =
      process.env.CORS_ORIGIN || "https://greek-learning-game-ts.vercel.app";
    this.pool = this.initializeDatabasePool();
    this.sampleData = {
      message: "Welcome to my Express app on Vercel!",
      data: [
        { id: 1, name: "John Doe", role: "Developer" },
        { id: 2, name: "Jane Smith", role: "Designer" },
      ],
    };

    // Setup middleware and routes
    this.setupMiddleware();
    this.setupRoutes();
  }

  // Encapsulate database pool initialization
  private initializeDatabasePool(): Pool {
    const config: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
    };

    if (process.env.DATABASE_URL) {
      config.ssl = { rejectUnauthorized: false }; // Required for Neon on Vercel
    }

    return new Pool(config);
  }

  // Encapsulate middleware setup
  private setupMiddleware(): void {
    this.app.use(
      cors({
        origin: this.corsOrigin,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );
    this.app.use(express.json());
  }

  // Encapsulate route definitions
  private setupRoutes(): void {
    this.app.get("/", this.handleRoot.bind(this));
    this.app.get("/testdata", this.handleTestData.bind(this));
    this.app.get("/dbtest", this.handleDbTest.bind(this));
    this.app.get("/users", this.handleUsers.bind(this));
  }

  // Route handlers as class methods for better organization
  private handleRoot(req: Request, res: Response): void {
    res.send("Subscribe to Arpan Neupane's channel");
  }

  private handleTestData(req: Request, res: Response): void {
    res.json(this.sampleData);
  }

  private async handleDbTest(req: Request, res: Response): Promise<void> {
    try {
      const { rows } = await this.pool.query("SELECT NOW()");
      res.json({ success: true, timestamp: rows[0].now });
    } catch (error) {
      console.error("Error in /dbtest:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  private async handleUsers(req: Request, res: Response): Promise<void> {
    try {
      const { rows } = await this.pool.query(
        "SELECT id, email, name FROM users"
      );
      res.json({ success: true, users: rows });
    } catch (error) {
      console.error("Error in /users:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  // Public method to start the server (only for local development)
  public start(): void {
    if (process.env.NODE_ENV !== "production") {
      this.app.listen(this.port, () => {
        console.log(`Server started on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`CORS Origin: ${this.corsOrigin}`);
        console.log(
          `Database URL: ${process.env.DATABASE_URL ? "Set" : "Not Set"}`
        );
      });
    }
  }

  // Getter for the Express app (needed for Vercel serverless export)
  public getApp(): Express {
    return this.app;
  }
}

// Instantiate the server
const server = new Server();

// Start the server if in local development
server.start();

// Export the Express app for Vercel
export default server.getApp();

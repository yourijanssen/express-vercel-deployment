import "dotenv/config";
import express, { Request, Response, Express } from "express";
import cors from "cors";
import { Pool, PoolConfig } from "pg";
import { AppController } from "./controllers";
import { setupRoutes } from "./routes";
import { createDbPool } from "./conf/db";
import { setupMiddleware } from "./conf/cors";

class Server {
  private app: Express;
  private port: number;
  private pool: Pool;
  private corsOrigin: string;
  private controller: AppController;

  constructor() {
    // Initialize properties
    this.app = express();
    this.port = parseInt(process.env.PORT || "8080", 10);
    this.corsOrigin =
      process.env.CORS_ORIGIN ||
      "https://express-vercel-deployment-ashen.vercel.app" ||
      "http://localhost:3000";
    this.pool = createDbPool();
    this.controller = new AppController(this.pool);

    // Setup middleware and routes
    this.setupMiddleware();
    this.setupRoutes();
  }

  // Encapsulate middleware setup by calling the external setup function
  private setupMiddleware(): void {
    setupMiddleware(this.app, this.corsOrigin);
  }

  // Encapsulate route definitions by calling the external setup function
  private setupRoutes(): void {
    setupRoutes(this.app, this.controller);
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

import express, { Express } from "express";
import { Pool } from "pg";
import { setupRoutes } from "./routes";
import { AppController } from "./controllers";
import { corsMiddleware } from "./conf/cors";

export class Server {
  private app: Express;
  private port: number;
  private pool: Pool;
  private controller: AppController;

  constructor(pool: Pool) {
    this.app = express();
    this.port = parseInt(process.env.PORT || "8080", 10);
    this.pool = pool;
    this.controller = new AppController(this.pool);

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(corsMiddleware);
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    setupRoutes(this.app, this.controller);
  }

  public start(): void {
    if (process.env.NODE_ENV !== "production") {
      this.app.listen(this.port, () => {
        console.log(`Server started on port ${this.port}`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`CORS Origin: ${process.env.CORS_ORIGIN || "Not Set"}`);
        console.log(
          `Database URL: ${process.env.DATABASE_URL ? "Set" : "Not Set"}`
        );
      });
    }
  }

  public getApp(): Express {
    return this.app;
  }
}

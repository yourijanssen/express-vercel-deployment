import express, { Express } from "express";
import cors from "cors";

// conf/cors.ts
export function setupMiddleware(
  app: Express,
  corsOrigin: string | string[]
): void {
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

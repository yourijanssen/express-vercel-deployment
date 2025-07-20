import express, { Express } from "express";
import cors from "cors";

export const setupMiddleware = (app: Express, corsOrigin: string): void => {
  app.use(
    cors({
      origin: corsOrigin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());
};

import { Express } from "express";
import { AppController } from "../controllers";

export const setupRoutes = (app: Express, controller: AppController): void => {
  // Existing routes
  app.get("/", controller.handleRoot.bind(controller));
  app.get("/testdata", controller.handleTestData.bind(controller));
  app.get("/dbtest", controller.handleDbTest.bind(controller));
  app.get("/users", controller.handleUsers.bind(controller));

  // New user management routes
  app.post("/register", controller.handleRegister.bind(controller));
  app.post("/login", controller.handleLogin.bind(controller));
  app.post("/logout", controller.handleLogout.bind(controller));
};

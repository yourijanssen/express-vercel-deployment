import "dotenv/config";
import { Server } from "./server";
import { createDbPool } from "./conf/db";

// Create database pool
const pool = createDbPool();

// Instantiate the server
const server = new Server(pool);

// Start the server if in local development
server.start();

// Export the Express app for Vercel
export default server.getApp();

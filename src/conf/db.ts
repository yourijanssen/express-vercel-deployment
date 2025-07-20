import { Pool, PoolConfig } from "pg";
import { getAllSchemas } from "../models";

export const createDbPool = (): Pool => {
  const config: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
  };

  if (process.env.DATABASE_URL) {
    config.ssl = { rejectUnauthorized: false }; // Required for Neon on Vercel
  }

  const pool = new Pool(config);

  // Initialize schemas (create tables if they don't exist) on pool creation
  initializeSchemas(pool).catch((error) => {
    console.error("Failed to initialize database schemas:", error);
  });

  return pool;
};

// Function to initialize database schemas
const initializeSchemas = async (pool: Pool): Promise<void> => {
  try {
    // Connect to the database to ensure it's reachable
    const client = await pool.connect();
    try {
      console.log("Connected to database, initializing schemas...");

      // Get all schema creation queries
      const schemaQueries = getAllSchemas();

      // Execute each schema query to create tables if they don't exist
      for (const query of schemaQueries) {
        await client.query(query);
        console.log("Executed schema query successfully");
      }

      console.log("Database schemas initialized successfully");
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (error) {
    console.error("Error during schema initialization:", error);
    throw error; // Re-throw to allow caller to handle or log the failure
  }
};

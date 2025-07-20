// import { Pool, PoolConfig } from "pg";

// export const createDbPool = (): Pool => {
//   const config: PoolConfig = {
//     connectionString: process.env.DATABASE_URL,
//   };

//   if (process.env.DATABASE_URL) {
//     config.ssl = { rejectUnauthorized: false }; // Required for Neon on Vercel
//   }

//   return new Pool(config);
// };

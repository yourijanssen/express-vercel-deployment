// import { Request, Response } from "express";
// import { Pool } from "pg";
// import { SampleData } from "../interfaces/types";

// export class AppController {
//   private pool: Pool;
//   private sampleData: SampleData;

//   constructor(pool: Pool) {
//     this.pool = pool;
//     this.sampleData = {
//       message: "Welcome to my Express app on Vercel!",
//       data: [
//         { id: 1, name: "John Doe", role: "Developer" },
//         { id: 2, name: "Jane Smith", role: "Designer" },
//       ],
//     };
//   }

//   handleRoot(req: Request, res: Response): void {
//     res.send("Subscribe to Arpan Neupane's channel");
//   }

//   handleTestData(req: Request, res: Response): void {
//     res.json(this.sampleData);
//   }

//   async handleDbTest(req: Request, res: Response): Promise<void> {
//     try {
//       const { rows } = await this.pool.query("SELECT NOW()");
//       res.json({ success: true, timestamp: rows[0].now });
//     } catch (error) {
//       console.error("Error in /dbtest:", error);
//       res.status(500).json({ success: false, error: (error as Error).message });
//     }
//   }

//   async handleUsers(req: Request, res: Response): Promise<void> {
//     try {
//       const { rows } = await this.pool.query(
//         "SELECT id, email, name FROM users"
//       );
//       res.json({ success: true, users: rows });
//     } catch (error) {
//       console.error("Error in /users:", error);
//       res.status(500).json({ success: false, error: (error as Error).message });
//     }
//   }
// }

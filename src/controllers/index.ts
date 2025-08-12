import { Request, Response } from "express";
import { Pool } from "pg";
import { SampleData } from "../interfaces/types";

/**
 * Controller class for handling HTTP requests related to general app functionality
 * and user management. This class interacts with the PostgreSQL database via a Pool
 * instance and provides endpoints for various operations.
 */
export class AppController {
  /** Database connection pool for executing queries. */
  private pool: Pool;

  /** Static sample data for testing or demo purposes. */
  private sampleData: SampleData;

  /**
   * Creates an instance of AppController.
   * @param {Pool} pool - PostgreSQL connection pool for database operations.
   */
  constructor(pool: Pool) {
    this.pool = pool;
    this.sampleData = {
      message: "Welcome to my Express app on Vercel!",
      data: [
        { id: 1, name: "John Doe", role: "Developer" },
        { id: 2, name: "Jane Smith", role: "Designer" },
      ],
    };
  }

  /**
   * Handles the root endpoint, returning a static welcome message.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void} Sends a static string response.
   */
  public handleRoot(req: Request, res: Response): void {
    res.send("Subscribe to Arpan Neupane's channel");
  }

  /**
   * Handles the test data endpoint, returning static sample data.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void} Sends a JSON response with sample data.
   */
  public handleTestData(req: Request, res: Response): void {
    res.json(this.sampleData);
  }

  /**
   * Handles the database test endpoint, querying the current timestamp.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Sends a JSON response with the current timestamp or an error message.
   */
  public async handleDbTest(req: Request, res: Response): Promise<void> {
    try {
      const { rows } = await this.pool.query("SELECT NOW()");
      res.json({ success: true, timestamp: rows[0].now });
    } catch (error) {
      console.error("Error in /dbtest:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  /**
   * Handles the users endpoint, retrieving a list of all users from the database.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Sends a JSON response with the list of users or an error message.
   */
  public async handleUsers(req: Request, res: Response): Promise<void> {
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

  public async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { rows } = await this.pool.query(
        "SELECT * FROM comments ORDER BY id DESC"
      );
      res.json({ success: true, comments: rows });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  }

  public async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { comment } = req.body;
      if (!comment) {
        res.status(400).json({ success: false, error: "Missing comment" });
        return;
      }
      const { rows } = await this.pool.query(
        "INSERT INTO comments (comment) VALUES ($1) RETURNING *",
        [comment]
      );
      res.status(201).json({ success: true, comment: rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: String(error) });
    }
  }

  /**
   * Handles user registration by creating a new user in the database.
   * @param {Request} req - The Express request object, expected to contain user details in the body.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Sends a JSON response with the created user details or an error message.
   * @remarks Password should be hashed in a production environment before storage (e.g., using bcrypt).
   */
  public async handleRegister(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      // Basic validation
      if (!email || !password || !name) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: email, password, name",
        });
        return;
      }

      // Check if user already exists
      const checkQuery = "SELECT id FROM users WHERE email = $1";
      const checkResult = await this.pool.query(checkQuery, [email]);
      if (checkResult.rows.length > 0) {
        res.status(409).json({
          success: false,
          error: "User with this email already exists",
        });
        return;
      }

      // Insert new user (password should be hashed in a real app)
      // TODO: Hash password using bcrypt or similar before storing
      const insertQuery =
        "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name";
      const insertResult = await this.pool.query(insertQuery, [
        email,
        password,
        name,
      ]);

      res.status(201).json({ success: true, user: insertResult.rows[0] });
    } catch (error) {
      console.error("Error in /register:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  /**
   * Handles user login by validating credentials against the database.
   * @param {Request} req - The Express request object, expected to contain email and password in the body.
   * @param {Response} res - The Express response object.
   * @returns {Promise<void>} Sends a JSON response with user details and a token on success, or an error message on failure.
   * @remarks Password comparison should use hashed values in a production environment (e.g., using bcrypt).
   *          Token generation (e.g., JWT) should be implemented for real applications.
   */
  public async handleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Basic validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: email, password",
        });
        return;
      }

      // Check user credentials
      const query =
        "SELECT id, email, name, password FROM users WHERE email = $1";
      const result = await this.pool.query(query, [email]);

      if (result.rows.length === 0) {
        res
          .status(401)
          .json({ success: false, error: "Invalid email or password" });
        return;
      }

      const user = result.rows[0];
      // TODO: Compare hashed password using bcrypt or similar in a real app
      if (user.password !== password) {
        res
          .status(401)
          .json({ success: false, error: "Invalid email or password" });
        return;
      }

      // TODO: Generate a JWT or session token in a real app
      res.status(200).json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name },
        token: "placeholder_token", // Replace with actual token generation
      });
    } catch (error) {
      console.error("Error in /login:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }

  /**
   * Handles user logout by returning a success message.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @returns {void} Sends a JSON response indicating successful logout.
   * @remarks In a production environment, this should invalidate the user's session or token (e.g., clear JWT).
   */
  public handleLogout(req: Request, res: Response): void {
    try {
      // TODO: Invalidate session or token in a real app (e.g., clear JWT from client or invalidate in DB)
      // For simplicity, just return a success response
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Error in /logout:", error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  }
}

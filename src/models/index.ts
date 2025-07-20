import { usersTableSchema } from "./users";

// Collect all schemas in one place for easy initialization
export const schemas = {
  users: usersTableSchema,
};

// Function to get all schema creation queries as an array
export const getAllSchemas = (): string[] => {
  return Object.values(schemas);
};

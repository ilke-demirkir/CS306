import { AppDataSource } from "../data-source";

/**
 * Inserts a record into the specified table.
 * @param table The name of the table.
 * @param data An object representing the record to insert.
 * @returns A promise that resolves when the insertion is complete.
 */
export async function insertRecord(table: string, data: Record<string, any>): Promise<any> {
  // Optionally restrict allowed tables
  const allowedTables = ["Student", "Dorm", "Course", "Department", "Professors", "Newsletter", "Publications", "Seminars", "Recitations"];
  if (!allowedTables.includes(table)) {
    throw new Error("Invalid table specified.");
  }

  // Build columns, placeholders, and values.
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map(() => "?").join(", ");
  const values = Object.values(data);

  // Build the SQL query string.
  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

  return await AppDataSource.manager.query(query, values);
}

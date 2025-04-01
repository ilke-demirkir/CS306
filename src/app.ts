import "reflect-metadata";
import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { insertRecord } from "./services/insertHelper";
import * as fs from "fs";
import * as path from "path";

const app = express();
app.use(express.json());

async function initializeDatabase() {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, "init.sql");
    const sqlQueries = fs.readFileSync(sqlFilePath, "utf8");
    
    // Execute the SQL queries
    await AppDataSource.manager.query(sqlQueries);
    console.log("Database initialized with raw SQL.");
  } catch (error) {
    console.error("Error executing raw SQL:", error);
    throw error;
  }
}
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "FE.html"));
  });

app.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
      // Expect the request body to have exactly one key.
      const keys = Object.keys(req.body);
      if (keys.length !== 1) {
        res.status(400).json({ message: "Request body must contain exactly one entity." });
        return;
      }
  
      const table = keys[0]; // e.g., "Student"
      const data = req.body[table];
  
      // Insert the record.
      await insertRecord(table, data);
  
      res.status(201).json({ message: `${table} inserted successfully.` });
      return;
    } catch (error) {
      console.error("Error inserting record:", error);
      res.status(500).json({ message: "Error inserting record", error});
      return;
    }
  });

AppDataSource.initialize()
  .then(async () => {
    await initializeDatabase();
    
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.error("Error during Data Source initialization", error));

import "reflect-metadata";
import express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { insertRecord } from "./services/insertHelper";
import * as fs from "fs";
import * as path from "path";
import { connectDB } from "./db";
import { Ticket, ITicket } from "./models/Ticket";
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

// Ticket services, ekstra bi dosya ile uğraşmak istemedim

app.post('/tickets', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      res.status(400).json({ error: 'title and description are required' });
      return;
    }
    const ticket = new Ticket({ title, description });
    await ticket.save();

    res.status(201).json(ticket);
    return;
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Example: GET /tickets to list all
app.get('/tickets', async (_req, res) => {
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  res.json(tickets);
});

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
    
    await connectDB();
    
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.error("Error during Data Source initialization", error));

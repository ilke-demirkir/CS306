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


// Ticket Backend

app.post('/tickets', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, message } = req.body;
    if (!username || !message) {
      res.status(400).json({ error: 'title and description are required' });
      return;
    }
    const ticket = new Ticket({ username, message });
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

// Fetch a single ticket by ID
app.get('/tickets/:id', async (req, res):Promise<void> => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(ticket);
});

// Add a comment to a ticket
app.post('/tickets/:id/comments', async (req, res):Promise<void> => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Comment text required' });
    return;
  }
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  ticket.comments.push({ text, date: new Date() });
  await ticket.save();
  res.json(ticket);
});

// Close (or reopen) a ticket
app.patch('/tickets/:id', async (req: Request, res: Response):Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    // Toggle or explicitly close:
    ticket.status = 'closed';
    await ticket.save();
    res.json(ticket);
  } catch (err: any) {
    console.error('Error closing ticket:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use(express.static(path.join(__dirname, '../public')));


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


  app.get(
    "/trigger/check-dorm-limit",
    async (req: Request, res: Response) => {
      const test = req.query.test as string | undefined;
  
      // We’ll accumulate a plaintext response:
      let output = "";
  
      try {
        // CASE A: insert two occupants into RoomID=1
        if (test === "A") {
          const room = 1;
  
          // Make sure any prior test data is cleaned up:
          /*
          await AppDataSource.manager.query(
            `DELETE FROM Live WHERE RoomID = 1`,
          );
  */
          // Insert two distinct StudentID values
          await AppDataSource.manager.query(
            `INSERT INTO Live (StudentID, RoomID) VALUES (11, 1)`
          );
          
  
          output = `Case A: Successfully inserted two occupants into room ${room}.`;
  
        // CASE B: attempt a third, expecting the trigger to block it
        } else if (test === "B") {
          const room = 1;
          const sid = 1002;
  
          try {
            await AppDataSource.manager.query(
              `INSERT INTO Live (StudentID, RoomID) VALUES (?, ?)`,
              [sid, room]
            );
            output = `Case B: ❌ Insert succeeded, but trigger should have blocked it.`;
          } catch (e: any) {
            // MySQL SIGNAL will throw an error here
            output = `Case B: ✅ Trigger fired as expected. Error: ${e.message}`;
          }
  
        // No test specified: show usage
        } else {
          output = [
            `Usage:`,
            `  GET /trigger/check-dorm-limit?test=A  → inserts two occupants (should succeed)`,
            `  GET /trigger/check-dorm-limit?test=B  → attempts third insert (should fail)`,
          ].join("\n");
        }
  
        res.type("text/plain").send(output);
  
      } catch (err: any) {
        console.error("Error running trigger test:", err);
        res
          .status(500)
          .type("text/plain")
          .send("Unexpected error: " + err.message);
      }
    }
  );
  
  
  
  
  // Trigger: check_department_limit
  // Prevents a student from joining more than 2 departments.
  // Usage: 
  //   GET /trigger/check-department-limit?test=A  → insert 2 departments (should succeed)  
  //   GET /trigger/check-department-limit?test=B  → insert 3rd department (should fail)
  
  app.get(
    "/trigger/check-department-limit",
    async (req: Request, res: Response) => {
      const test = req.query.test as string | undefined;
      let output = "";
  
      try {
        const studentId = 2000; // dummy student ID
        // Clean up any prior test data for this student:
        await AppDataSource.manager.query(
          `DELETE FROM memberof WHERE StudentID = ${studentId};`,
  
          
        );
  
        if (test === "A") {
          // CASE A: insert two department memberships → should both succeed
          for (const deptId of [1, 2]) {
            await AppDataSource.manager.query(
              `INSERT INTO memberof (StudentID, DepartmentID) VALUES (${studentId}, ${deptId})`,
            );
          }
          output = `Case A: Successfully inserted  department(1 ) for student ${studentId}.`;
  
        } else if (test === "B") {
          // CASE B: attempt a third department → trigger should block
          // first insert the two valid ones
          for (const deptId of [1, 2]) {
            await AppDataSource.manager.query(
              `INSERT IGNORE INTO memberof (StudentID, DepartmentID) VALUES (1, 2);
              INSERT IGNORE INTO memberof (StudentID, DepartmentID) VALUES (1, 1);
              INSERT IGNORE INTO memberof (StudentID, DepartmentID) VALUES (1, 3);
              `,
              [studentId, deptId]
            );
          }
          // now try the third
          try {
            await AppDataSource.manager.query(
              `INSERT INTO memberof (StudentID, DepartmentID) VALUES (?, ?)`,
              [studentId, 3]
            );
            output = `Case B: ❌ Insert succeeded, but trigger should have blocked department 3.`;
          } catch (e: any) {
            output = `Case B: ✅ Trigger fired as expected. Error: ${e.message}`;
          }
  
        } else {
          // No test param: show usage
          output = [
            `Usage:`,
            `  GET /trigger/check-department-limit?test=A  → inserts two departments (should succeed)`,
            `  GET /trigger/check-department-limit?test=B  → attempts third insert (should fail)`,
          ].join("\n");
        }
  
        res.type("text/plain").send(output);
      } catch (err: any) {
        console.error("Error in check-department-limit trigger test:", err);
        res
          .status(500)
          .type("text/plain")
          .send("Unexpected error: " + err.message);
      }
    }
  );
  
  
  // Trigger: prof_course_limit
  // Prevents a professor from teaching more than 2 courses.
  // Usage:
  //   GET /trigger/prof-course-limit?test=A  → assign 2 courses (should succeed)
  //   GET /trigger/prof-course-limit?test=B  → assign a 3rd (should fail)
  
  app.get(
    "/trigger/prof-course-limit",
    async (req: Request, res: Response) => {
      const test = req.query.test as string | undefined;
      let output = "";
  
      // use a dummy profid that doesn't conflict with real data
      const profId = 1;
  
      try {
        // 0) clean up any prior test rows for this prof
        await AppDataSource.manager.query(
          `DELETE FROM Teach WHERE profid = ?`,
          [profId]
        );
  
        if (test === "A") {
          // CASE A: insert two course assignments → both should succeed
          for (const crn of ["CS201"]) {
            await AppDataSource.manager.query(
              `INSERT INTO Teach (profid, CRN) VALUES (?, ?)`,
              [profId, crn]
            );
          }
          output = `Case A: Successfully assigned courses CS201 & CS300 to professor ${profId}.`;
  
        } else if (test === "B") {
          // CASE B: first insert the two allowed ones
          for (const crn of ["CS201", "CS300"]) {
            await AppDataSource.manager.query(
              `INSERT IGNORE INTO Teach (profid, CRN) VALUES (?, ?)`,
              [profId, crn]
            );
          }
          // now attempt a third assignment
          try {
            await AppDataSource.manager.query(
              `INSERT INTO Teach (profid, CRN) VALUES (?, ?)`,
              [profId, "CS301"]
            );
            output = `Case B: ❌ Insert succeeded, but trigger should have blocked CS301 assignment.`;
          } catch (e: any) {
            output = `Case B: ✅ Trigger fired as expected. Error: ${e.message}`;
          }
  
        } else {
          // no test param: show usage
          output = [
            `Usage:`,
            `  GET /trigger/prof-course-limit?test=A  → assign 2 courses (should succeed)`,
            `  GET /trigger/prof-course-limit?test=B  → attempt 3rd assignment (should fail)`,
          ].join("\n");
        }
  
        res.type("text/plain").send(output);
      } catch (err: any) {
        console.error("Error in prof_course_limit trigger test:", err);
        res
          .status(500)
          .type("text/plain")
          .send("Unexpected error: " + err.message);
      }
    }
  );
  
  
  // Trigger: prerequisite_limit
  // Prevents a course from having more than 2 prerequisites.
  // Usage:
  //   GET /trigger/prerequisite-limit?test=A  → insert 2 prereqs (should succeed)
  //   GET /trigger/prerequisite-limit?test=B  → insert a 3rd (should fail)
  
  app.get(
    "/trigger/prerequisite-limit",
    async (req: Request, res: Response) => {
      const test = req.query.test as string | undefined;
      let output = "";
  
      // choose a CRN that exists in Course
      const crn = "CS306";
  
      try {
        // clean up any prior test rows for this CRN
        await AppDataSource.manager.query(
          `DELETE FROM course_prerequisites WHERE CRN = ?`,
          [crn]
        );
  
        if (test === "A") {
          // CASE A: insert two prerequisites → should both succeed
          for (const id of [1000, 1001]) {
            await AppDataSource.manager.query(
              `INSERT INTO course_prerequisites (coursePrerequisitesID, CRN, Course_Name)
               VALUES (?, ?, ?)`,
              [id, crn, `Prereq${id}`]
            );
          }
          output = `Case A: Successfully added two prerequisites for CRN ${crn}.`;
  
        } else if (test === "B") {
          // CASE B: first insert the two allowed ones
          for (const id of [1000, 1001]) {
            await AppDataSource.manager.query(
              `INSERT IGNORE INTO course_prerequisites (coursePrerequisitesID, CRN, Course_Name)
               VALUES (?, ?, ?)`,
              [id, crn, `Prereq${id}`]
            );
          }
          // now attempt a third
          try {
            await AppDataSource.manager.query(
              `INSERT INTO course_prerequisites (coursePrerequisitesID, CRN, Course_Name)
               VALUES (?, ?, ?)`,
              [1002, crn, `Prereq1002`]
            );
            output = `Case B: ❌ Insert succeeded, but trigger should have blocked the 3rd prerequisite.`;
          } catch (e: any) {
            output = `Case B: ✅ Trigger fired as expected. Error: ${e.message}`;
          }
  
        } else {
          // no test param: show usage
          output = [
            `Usage:`,
            `  GET /trigger/prerequisite-limit?test=A  → insert 2 prerequisites (should succeed)`,
            `  GET /trigger/prerequisite-limit?test=B  → attempt 3rd insert (should fail)`,
          ].join("\n");
        }
  
        res.type("text/plain").send(output);
      } catch (err: any) {
        console.error("Error in prerequisite_limit trigger test:", err);
        res
          .status(500)
          .type("text/plain")
          .send("Unexpected error: " + err.message);
      }
    }
  );
  
  
  // Trigger: prof_faculty_limit
  // Prevents a professor from working in more than one faculty.
  // Usage:
  //   GET /trigger/prof-faculty-limit?test=A  → assign professor once (should succeed)
  //   GET /trigger/prof-faculty-limit?test=B  → assign professor twice (should fail)
  
  app.get(
    "/trigger/prof-faculty-limit",
    async (req: Request, res: Response) => {
      const test = req.query.test as string | undefined;
      let output = "";
  
      // dummy profid to isolate tests
      const profId = 1;
  
      try {
        // clean up any prior test rows
        await AppDataSource.manager.query(
          `DELETE FROM Teach WHERE profid = ?`,
          [profId]
        );
  
        if (test === "A") {
          // CASE A: single assignment → should succeed
          await AppDataSource.manager.query(
            `INSERT INTO Teach (profid, CRN) VALUES (?, ?)`,
            [profId, "CS201"]
          );
          output = `Case A: Successfully assigned professor ${profId} to one faculty (via Teach).`;
  
        } else if (test === "B") {
          // CASE B: first insert allowed
          await AppDataSource.manager.query(
            `INSERT INTO Teach (profid, CRN) VALUES (?, ?)`,
            [profId, "CS201"]
          );
          // now attempt second assignment → trigger should block
          try {
            await AppDataSource.manager.query(
              `INSERT INTO Teach (profid, CRN) VALUES (?, ?)`,
              [profId, "CS300"]
            );
            output = `Case B: ❌ Insert succeeded, but trigger should have blocked the second assignment.`;
          } catch (e: any) {
            output = `Case B: ✅ Trigger fired as expected. Error: ${e.message}`;
          }
  
        } else {
          // no test param: usage instructions
          output = [
            `Usage:`,
            `  GET /trigger/prof-faculty-limit?test=A  → single insert (should succeed)`,
            `  GET /trigger/prof-faculty-limit?test=B  → second insert (should fail)`,
          ].join("\n");
        }
  
        res.type("text/plain").send(output);
      } catch (err: any) {
        console.error("Error in prof_faculty_limit trigger test:", err);
        res
          .status(500)
          .type("text/plain")
          .send("Unexpected error: " + err.message);
      }
    }
  );
  // PROCEDURES
  
  
  // Stored‐procedure: CalculateAvgStuGrade
  // Computes the average grade for a given student.
  // Usage:
  //   GET /proc/calc-avg-grade?stu_id=123
  
  app.get(
    "/proc/calc-avg-grade",
    async (req: Request, res: Response): Promise<void> => {
      const stuId = parseInt(req.query.stu_id as string);
      if (isNaN(stuId)) {
        res.status(400).json({ error: "Please provide a valid stu_id query parameter." });
        return;
      }
  
      try {
        // 1) Call the SP, mapping the OUT param to @avg
        await AppDataSource.manager.query(
          `CALL CalculateAvgStuGrade(?,@avg);`,
          [stuId]
        );
  
        // 2) Retrieve the OUT parameter
        const grad = await AppDataSource.manager.query(
          `SELECT @avg;`
        );
        
        /*const [[{ "@avg": average }]]: any = await AppDataSource.manager.query(
          `SELECT @avg;`
        );*/
  
        // 3) Respond with JSON
        res.json( grad[0]["@avg"]);
        return;
      } catch (err: any) {
        console.error("Error calling CalculateAvgStuGrade:", err);
        res.status(500).json({ error: "Failed to calculate average grade.", detail: err.message });
        return;
      }
    }
  );
  
  
  // Stored‐procedure: CalculateCourseAvgGrade
  // Computes the average grade for a given course.
  // Usage:
  //   GET /proc/calc-course-avg?crn=CS101
  
  app.get(
    "/proc/calc-course-avg",
    async (req: Request, res: Response):Promise<void>=> {
      const crn = (req.query.crn as string)?.trim();
      if (!crn) {
        res.status(400).json({ error: "Please provide a valid crn query parameter." });
        return;
      }
      const a = `CALL CalculateCourseAvgGrade("${crn}", @c_avg);`;
      try {
        // 1) Call the SP, mapping the OUT param to @c_avg
        const b = await AppDataSource.manager.query(
          `CALL CalculateCourseAvgGrade("${crn}", @c_avg);`
        );
        console.log(b);
  
        // 2) Retrieve the OUT parameter
        const cavg = await AppDataSource.manager.query(
          `SELECT @c_avg;`
        );
        
        // 3) Respond with JSON
        res.json(b[0][0]["AVG(E.grade)"]);
        return;
      } catch (err: any) {
        console.error("Error calling CalculateCourseAvgGrade:", err);
        res.status(500).json({ error: "Failed to calculate course average grade.", detail: err.message });
        return;
      }
    }
  );
  
  
  // Stored‐procedure: CalculateStuCredit
  // Computes the total number of credits a student has enrolled in.
  // Usage:
  //   GET /proc/calc-stu-credit?stu_id=123
  app.get(
    "/proc/calc-stu-credit",
    async (req: Request, res: Response):Promise<void> => {
      const stuId = parseInt(req.query.stu_id as string, 10);
      if (isNaN(stuId)) {
        res.status(400).json({ error: "Please provide a valid stu_id query parameter." });
        return;
      }
  
      try {
        // 1) Call the SP, mapping the OUT param to @total_credit
       const b=  await AppDataSource.manager.query(
          `CALL CalculateStuCredit(?, @total_credit);`,
          [stuId]
        );
  
        // 2) Retrieve the OUT parameter
        const a  =
          await AppDataSource.manager.query(`SELECT @total_credit;`);
        console.log(b);
        // 3) Respond with JSON
        res.json( b[0][0]['SUM(C.Credits)']);
        return;
      } catch (err: any) {
        console.error("Error calling CalculateStuCredit:", err);
        res.status(500).json({ error: "Failed to calculate total credit.", detail: err.message });
        return;
      }
    }
  );
  
  // Stored‐procedure: Course_Professors
  // Lists all courses taught by a professor (by full name).
  // Usage:
  //   GET /proc/course-professors?prof_name=John%20Doe
  
  app.get(
    "/proc/course-professors",
    async (req: Request, res: Response):Promise<void> => {
      const profName = (req.query.prof_name as string)?.trim();
      if (!profName) {
        res.status(400).json({ error: "Please provide a prof_name query parameter." });
        return;
      }
  
      try {
        // 1) Call the SP; it returns a result‐set of CourseName rows
        const result: any[] = await AppDataSource.manager.query(
          `CALL Course_Professors(?);`,
          [profName]
        );
  
        // 2) The first element holds the row array
        const rows = Array.isArray(result) ? result[0] : result;
  
        // 3) Extract course names into a simple list
        const courses = rows.map((r: any) => r.CourseName);
  
        res.json({ professor: profName, courses });
        return;
      } catch (err: any) {
        console.error("Error calling Course_Professors:", err);
        res.status(500).json({ error: "Failed to list courses for professor.", detail: err.message });
        return;
      }
    }
  );
  
  
  
  // Stored‐procedure: DepBirthRank
  // Lists the first n students (by enrollment date) in a department.
  // Usage:
  //   GET /proc/dep-birth-rank?dep_id=1&n=5
  
  app.get(
    "/proc/dep-birth-rank",
    async (req: Request, res: Response):Promise<void> => {
      const depId   = parseInt(req.query.dep_id as string, 10);
      const n       = parseInt(req.query.n      as string, 10);
  
      if (isNaN(depId) || isNaN(n) || n < 1) {
        res.status(400).json({ error: "Please provide valid dep_id and n (n ≥ 1) query parameters." });
        return;
      }
  
      try {
        // 1) Call the SP, which returns a result‐set of StudentID rows
        const result: any[] = await AppDataSource.manager.query(
          `CALL DepBirthRank(?, ?);`,
          [depId, n]
        );
  
        // 2) Extract the rows (first element of result)
        const rows = Array.isArray(result) ? result[0] : result;
  
        // 3) Pull out the student IDs
        const studentIds = rows.map((r: any) => r.StudentID);
  
        // 4) Respond with JSON
        res.json({ departmentId: depId, firstNStudents: studentIds });
        return;
      } catch (err: any) {
        console.error("Error calling DepBirthRank:", err);
        res.status(500).json({ error: "Failed to retrieve birth‐ranked students.", detail: err.message });
        return;
      }
    }
  );




AppDataSource.initialize()
  .then(async () => {
    await initializeDatabase();
    
    await connectDB();

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => console.error("Error during Data Source initialization", error));

import express from "express";
import db from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.post("/assignments", async (req, res) => {
  const { title, content, category, email } = req.body || {};
  const errors = [];

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  }

  if (typeof content !== "string") {
    errors.push({ field: "content", message: "Content must be a string" });
  } else if (content.length < 500 || content.length > 1000) {
    errors.push({
      field: "content",
      message: "Content length must be between 500 and 1000 characters",
    });
  }

  const allowedCategories = ["Math", "English", "Biology"];
  if (typeof category !== "string" || !allowedCategories.includes(category)) {
    errors.push({
      field: "category",
      message: 'Category must be one of "Math", "English", "Biology"',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    errors.push({ field: "email", message: "Email must be a valid email address" });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (db) {
    try {
      const insertSql =
        "INSERT INTO assignments(title, content, category, creator_email) VALUES($1,$2,$3,$4) RETURNING id";
      const result = await db.query(insertSql, [title, content, category, email]);
      return res
        .status(201)
        .json({ message: "Create assignment successfully", id: result.rows[0]?.id });
    } catch (error) {
      return res.status(500).json({ message: "Database error", error: String(error?.message || error) });
    }
  }

  return res.status(201).json({ message: "Create assignment successfully" });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

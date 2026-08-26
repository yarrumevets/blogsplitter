import express from "express";
import "dotenv/config";
import { Pool } from "pg";
import uploadsRouter from "./routes/uploads.js";

const PORT = Number(process.env.PORT);
const NODE_ENV = process.env.NODE_ENV;

// ------------ POSTGRES ------------ //
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.query("SELECT NOW()")
  .then(({ rows }) => {
    console.log("Postgres connected:", rows[0].now);
  })
  .catch((error) => {
    console.error("Postgres connection failed:", error);
  });

// ------------ Express Server ------------ //

const app = express();
app.use(express.json());

// ------------ API Endpoints ------------ //

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Create post
app.post("/posts", async (req, res) => {
  const { title, body_html } = req.body;
  const result = await db.query(
    `INSERT INTO posts (user_id, title, body_html)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [1, title, body_html],
  );
  res.status(201).json(result.rows[0]);
});

// Get all posts
app.get("/posts", async (_req, res) => {
  const result = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
  res.json(result.rows);
});

// Routes
app.use("/uploads", uploadsRouter);

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT} (${NODE_ENV})`);
});

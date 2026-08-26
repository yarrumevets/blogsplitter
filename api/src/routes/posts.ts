import { Router } from "express";
import db from "../db";

const router = Router();

router.post("/", async (req, res) => {
  const { title, body_html } = req.body;
  const result = await db.query(
    `INSERT INTO posts (user_id, title, body_html)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [1, title, body_html],
  );
  res.status(201).json(result.rows[0]);
});

router.get("/", async (_req, res) => {
  const result = await db.query("SELECT * FROM posts ORDER BY created_at DESC");
  res.json(result.rows);
});

export default router;

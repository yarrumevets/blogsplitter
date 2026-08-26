import { Router } from "express";
import db from "../db";

const router = Router();

router.post("/", async (req, res) => {
  const { title, body_html } = req.body;
  if (!title || !body_html) {
    return res.status(400).json({
      error: "title and body_html are required",
    });
  }
  try {
    const result = await db.query(
      `INSERT INTO posts (user_id, title, body_html)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [1, title, body_html], // @TODO: Replace with dynamic user, instead of '1'.
    );

    // Add tags to the tags table and post_tags
    const tags: string[] = req.body.tags ?? [];
    for (const name of tags) {
      const tagResult = await db.query(
        `INSERT INTO tags (name)
     VALUES ($1)
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
        [name.trim()],
      );
      await db.query(
        `INSERT INTO post_tags (post_id, tag_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
        [result.rows[0].id, tagResult.rows[0].id],
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const result = await db.query(`
  SELECT
    posts.*,
    COALESCE(
      ARRAY_AGG(tags.name) FILTER (WHERE tags.name IS NOT NULL),
      '{}'
    ) AS tags
  FROM posts
  LEFT JOIN post_tags ON post_tags.post_id = posts.id
  LEFT JOIN tags ON tags.id = post_tags.tag_id
  GROUP BY posts.id
  ORDER BY posts.created_at DESC
`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

export default router;

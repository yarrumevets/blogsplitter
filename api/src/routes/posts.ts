// @TODO: Handle duplicate post titles by generating unique slugs.
// @TODO: Handle titles that generate an empty slug.

import { Router } from "express";
import db from "../db.js";

const router = Router();

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

router.post("/", async (req, res) => {
  const { title, body_html } = req.body;
  if (!title || !body_html) {
    return res.status(400).json({
      error: "title and body_html are required",
    });
  }
  try {
    const slug = createSlug(title);

    const result = await db.query(
      `INSERT INTO posts (user_id, title, slug, body_html)
   VALUES ($1, $2, $3, $4)
   RETURNING *`,
      [1, title, slug, body_html],
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

// Just load the post without context of any blog. (Intended only for special use cases)
router.get("/:user/:post", async (req, res) => {
  const { user, post } = req.params;

  try {
    const result = await db.query(
      `
      SELECT posts.*
      FROM posts
      JOIN users ON users.id = posts.user_id
      WHERE users.name = $1
        AND posts.slug = $2
      LIMIT 1
      `,
      [user, post],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

export default router;

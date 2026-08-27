import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/:slug/posts", async (req, res) => {
  const blogResult = await db.query("SELECT * FROM blogs WHERE slug = $1", [
    req.params.slug,
  ]);

  if (blogResult.rowCount === 0) {
    return res.status(404).json({ error: "Blog not found" });
  }

  const blog = blogResult.rows[0];

  const result = await db.query(
    `
  SELECT
    posts.*,
    COALESCE(
      ARRAY_AGG(DISTINCT tags.name) FILTER (WHERE tags.name IS NOT NULL),
      '{}'
    ) AS tags
  FROM posts
  LEFT JOIN post_tags ON post_tags.post_id = posts.id
  LEFT JOIN tags ON tags.id = post_tags.tag_id
  WHERE EXISTS (
    SELECT 1
    FROM post_tags match_post_tags
    JOIN tags match_tags ON match_tags.id = match_post_tags.tag_id
    WHERE match_post_tags.post_id = posts.id
      AND match_tags.name = ANY($1)
  )
  GROUP BY posts.id
  ORDER BY posts.created_at DESC
  `,
    [blog.required_tags],
  );

  res.json({
    blog: {
      id: blog.id,
      name: blog.name,
      slug: blog.slug,
      required_tags: blog.required_tags,
    },
    posts: result.rows,
  });
});

router.get("/", async (_req, res) => {
  const result = await db.query(
    "SELECT id, name, slug, required_tags FROM blogs ORDER BY name",
  );

  res.json(result.rows);
});

export default router;

// Load post in context of a particular blog and verify it belongs to that blog's query.
router.get("/:user/:blog/:post", async (req, res) => {
  const { user, blog, post } = req.params;

  try {
    const result = await db.query(
      `
      SELECT posts.*
      FROM posts
      JOIN users ON users.id = posts.user_id
      JOIN blogs ON blogs.user_id = users.id
      WHERE users.name = $1
        AND blogs.slug = $2
        AND posts.slug = $3
        AND EXISTS (
                SELECT 1
                FROM post_tags match_post_tags
                JOIN tags match_tags ON match_tags.id = match_post_tags.tag_id
                WHERE match_post_tags.post_id = posts.id
                  AND match_tags.name = ANY(blogs.required_tags)
        )
      LIMIT 1
      `,
      [user, blog, post],
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

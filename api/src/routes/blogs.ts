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

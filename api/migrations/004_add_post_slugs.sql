ALTER TABLE posts
ADD COLUMN slug TEXT;

UPDATE posts
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-|-$)',
    '',
    'g'
  )
);

ALTER TABLE posts
ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX posts_user_slug_unique
ON posts(user_id, slug);
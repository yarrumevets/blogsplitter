ALTER TABLE blogs
ADD COLUMN user_id INTEGER;

UPDATE blogs
SET user_id = 1;

ALTER TABLE blogs
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE blogs
ADD CONSTRAINT blogs_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id);

CREATE UNIQUE INDEX blogs_user_slug_unique
ON blogs(user_id, slug);
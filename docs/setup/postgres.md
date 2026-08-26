# Postgres

NPM: `npm install pg`

## Installation

```
brew install postgresql@17
brew services start postgresql@17
psql postgres
```

## Database Setup

Create the database:
`CREATE DATABASE blogsplitter;`

Show DBs:
`\l`

Connect to the DB:
`\c blogsplitter`

Create app user:
`CREATE USER blogsplitter_app WITH PASSWORD 'choose-a-password';`

Grant the app access to the DB:
`GRANT ALL PRIVILEGES ON DATABASE blogsplitter TO blogsplitter_app;`

Let blogsplitter_app access the public schema and create tables/other objects inside it:
`GRANT USAGE, CREATE ON SCHEMA public TO blogsplitter_app;`

Check that everything was setup with:

```
\l
\dn+
\du
```

[`README.md`](../../README.md)

## Migrations

Creating the tables:

`api/migrations/001_initial.sql`

Run the migration: `psql "$(grep '^DATABASE_URL=' .env | cut -d '=' -f2-)" -f migrations/001_initial.sql`

⚠️ Temporary step: Manually creating a user. This won't be necessary once a sign-up feature is built ⚠️

Insert the first user and get their id:

```
INSERT INTO users (name)
VALUES ('yourname')
RETURNING id;
```

## Create blogs manually

blog name , url-friendly slug , tags

```
INSERT INTO blogs (name, slug, required_tags)
VALUES
  ('3d Printing Blog', '3dprint', ARRAY['3dprint', '3dprinting']),
  ('Motor Bikes Blog', 'moto', ARRAY['moto', 'motorcycle', 'scooter']);
```

Query them after adding some posts that have matching tags:

```
curl http://localhost:3949/blogs/3dprint/posts
curl http://localhost:3949/blogs/moto/posts
```

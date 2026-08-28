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

## Install PostgreSQL on Linux (Ubuntu):

`sudo apt update && sudo apt install -y postgresql-client`

Verify:
`psql --version`

If it failed to install you can try:
`sudo apt --fix-broken install`

Install PostgreSQL;
`sudo apt install -y postgresql`

Set to start at system boot and start now.

```
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Create user:

```
sudo -u postgres createuser --pwprompt blogsplitter_app
```

Enter the password here and in [`api/.env`]
(../../api/.env) (Created from [.env.example](../../api/.env.example))

Create the database:
`sudo -u postgres createdb -O blogsplitter_app blogsplitter`

### Apply migrations

001_initial.sql:

! make sure to put your password instead of YOUR_PASSWORD

```
cd api
psql "postgresql://blogsplitter_app:YOUR_PASSWORD@localhost:5432/blogsplitter" -v ON_ERROR_STOP=1 -f migrations/001_initial.sql
```

Verify the tables exis:
`psql "$DATABASE_URL" -c "\dt"`

⚠️ If you get the following eror...
`$DATABASE_URL is not exported into your shell, so psql fell back to your Linux user ubuntu.`

Run:

```
set -a
source .env
set +a
psql "$DATABASE_URL" -c "\dt"
```

Run the remaining migrations (5 as of writing this)

```
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/002_blogs_and_tags.sql

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/003_normalize_tags.sql

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/004_add_post_slugs.sql

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/005_add_blog_user_id.sql
```

Verify all tables:
`psql "$DATABASE_URL" -c "\dt"`

Seed user ID 1:
`psql "$DATABASE_URL" -c "INSERT INTO users (name) VALUES ('steve') RETURNING id;"`

Create 2 test blogs:

```
psql "$DATABASE_URL" -c "
INSERT INTO blogs (user_id, name, slug, required_tags)
VALUES
  (1, '3d Printing Blog', '3dprint', ARRAY['3dprint', '3dprinting']),
  (1, 'Motor Bikes Blog', 'moto', ARRAY['moto', 'motorcycle', 'scooter']);
"
```

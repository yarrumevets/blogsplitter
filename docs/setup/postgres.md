# PostgreSQL Setup Notes

> ⚠️ **These are project setup notes, not universal PostgreSQL instructions.**

# Node Dependency

```bash
npm install pg
```

# Local Installation (macOS)

```bash
brew install postgresql@17
brew services start postgresql@17
psql postgres
```

## Database Setup

Create the database:

```sql
CREATE DATABASE blogsplitter;
```

List databases:

```text
\l
```

Connect:

```text
\c blogsplitter
```

Create the application user:

```sql
CREATE USER blogsplitter_app WITH PASSWORD 'choose-a-password';
```

Grant database access:

```sql
GRANT ALL PRIVILEGES ON DATABASE blogsplitter TO blogsplitter_app;
```

Allow access to the `public` schema:

```sql
GRANT USAGE, CREATE ON SCHEMA public TO blogsplitter_app;
```

Verify:

```text
\l
\dn+
\du
```

# Migrations

Migration files are located in:

```text
api/migrations/
```

Run the initial migration from `/api`:

```bash
psql "$(grep '^DATABASE_URL=' .env | cut -d '=' -f2-)" \
  -v ON_ERROR_STOP=1 \
  -f migrations/001_initial.sql
```

## Seed Initial User

> ⚠️ Temporary until authentication/sign-up is implemented.

```sql
INSERT INTO users (name)
VALUES ('yourname')
RETURNING id;
```

## Create Test Blogs

```sql
INSERT INTO blogs (user_id, name, slug, required_tags)
VALUES
  (1, '3d Printing Blog', '3dprint', ARRAY['3dprint', '3dprinting']),
  (1, 'Motor Bikes Blog', 'moto', ARRAY['moto', 'motorcycle', 'scooter']);
```

Test matching posts:

```bash
curl http://localhost:3949/blogs/3dprint/posts
curl http://localhost:3949/blogs/moto/posts
```

# PostgreSQL on Ubuntu / EC2

Update package information:

```bash
sudo apt update
```

Install PostgreSQL:

```bash
sudo apt install -y postgresql postgresql-client
```

If package installation fails:

```bash
sudo apt --fix-broken install
```

Verify:

```bash
psql --version
```

Enable PostgreSQL at startup and start it now:

```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

## Create Application User

```bash
sudo -u postgres createuser --pwprompt blogsplitter_app
```

Use the same password in:

```text
api/.env
```

Create the database owned by the application user:

```bash
sudo -u postgres createdb -O blogsplitter_app blogsplitter
```

## Loading `.env` Variables Into the Shell

To make variables from `api/.env` available to shell commands for the **current session**:

```bash
set -a
source .env
set +a
```

- `set -a` — automatically exports variables defined afterward.
- `source .env` — loads the variables from `.env`.
- `set +a` — stops automatic exporting; already exported variables remain available.

They remain available until that shell session ends.

```bash
psql "$DATABASE_URL"
```

# Production Migrations

From `/api`, load environment variables as described above.

Then verify the connection:

```bash
psql "$DATABASE_URL" -c "\dt"
```

Run migrations in order:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/001_initial.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/002_blogs_and_tags.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/003_normalize_tags.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/004_add_post_slugs.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/005_add_blog_user_id.sql
```

Verify all tables:

```bash
psql "$DATABASE_URL" -c "\dt"
```

# Production Seed Data

Seed the temporary user:

```bash
psql "$DATABASE_URL" -c "
INSERT INTO users (name)
VALUES ('yourname')
RETURNING id;
"
```

Create test blogs:

```bash
psql "$DATABASE_URL" -c "
INSERT INTO blogs (user_id, name, slug, required_tags)
VALUES
  (1, '3d Printing Blog', '3dprint', ARRAY['3dprint', '3dprinting']),
  (1, 'Motor Bikes Blog', 'moto', ARRAY['moto', 'motorcycle', 'scooter']);
"
```

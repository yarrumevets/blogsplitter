# Postgres

NPM: `npm install pg`

## Installaction

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

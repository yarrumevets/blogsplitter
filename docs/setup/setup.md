# Blog Splitter Setup Notes

> ⚠️ **These are not complete setup instructions.**
> This document records the main setup and deployment steps used for this project.

# Next.js

## Initialization

```bash
npx create-next-app@latest .
```

Configuration used:

```text
TypeScript: Yes
Linter: ESLint
React Compiler: Yes
Tailwind CSS: No
src/ directory: Yes
App Router: Yes
Custom import alias: Yes
Import alias: @/*
AGENTS.md: Yes
Package manager: npm
```

Frontend directory:

```text
/frontend
```

# TypeScript / API

Install type definitions:

```bash
npm install -D @types/pg @types/express
```

`api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Relevant API scripts:

```json
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

## Test POST Endpoint

```bash
curl -X POST http://localhost:3949/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test post","body_html":"<p>Hello world</p>"}'
```

Verify in PostgreSQL:

```sql
SELECT * FROM posts;
```

Fetch posts:

```bash
curl http://localhost:3949/posts
```

# S3 Image Uploads

Install dependencies:

```bash
npm install @aws-sdk/client-s3 multer
npm install -D @types/multer
```

Relevant files:

```text
api/src/s3.ts
api/src/routes/uploads.ts
```

## S3 Bucket

Create an S3 bucket and an IAM identity with programmatic access.

Example IAM policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

Add the AWS credentials and bucket configuration to:

```text
api/.env
```

If objects are intended to be publicly readable, configure the bucket accordingly.

Example bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

## Test Upload Route

```bash
curl -X POST http://localhost:3949/uploads \
  -F "image=@/full/path/to/test-image.jpg"
```

# EC2 Deployment

This project is manually deployed to an EC2 instance. These steps may also be useful for similar Linux-based deployments.

## Clone Repository

```bash
git clone https://github.com/yarrumevets/blogsplitter.git
cd blogsplitter
```

## Install Dependencies

```bash
npm install
npm --prefix api install
npm --prefix frontend install
```

## PostgreSQL

See:

```text
docs/postgres.md
```

for PostgreSQL installation and configuration notes.

## API Environment

Create:

```text
api/.env
```

Using `api/.env.example` as the template.

For production, ensure:

```text
NODE_ENV=production
```

and provide the appropriate database and AWS configuration.

## Build and Run API

```bash
cd api
npm run build
npm run start
```

Using PM2:

```bash
pm2 start npm --name blogsplitter-api -- start
```

# Frontend Deployment

Normally:

```bash
cd frontend
npm run build
```

The frontend uses Next.js standalone output:

```ts
const nextConfig = {
  output: "standalone",
};
```

If building directly on the server is impractical, build locally and deploy the generated output.

## Build Locally

```bash
cd frontend
npm run build
```

Package the required files:

```bash
tar -czf frontend-build.tar.gz .next/standalone .next/static public
```

Copy the archive to the server:

```bash
scp -i ~/.ssh/MY_KEY.pem \
  frontend-build.tar.gz \
  ubuntu@YOUR_SERVER:~/blogsplitter/
```

## Deploy on Server

```bash
cd ~/blogsplitter/frontend

tar -xzf ../frontend-build.tar.gz

mkdir -p .next/standalone/frontend/.next

cp -r .next/static .next/standalone/frontend/.next/
cp -r public .next/standalone/frontend/

pm2 restart blogsplitter-frontend
```

# Updating the Frontend in Production

Local:

```bash
cd frontend

npm run build

tar -czf frontend-build.tar.gz .next/standalone .next/static public

scp -i ~/.ssh/MY_KEY.pem \
  frontend-build.tar.gz \
  ubuntu@YOUR_SERVER:~/blogsplitter/
```

Server:

```bash
cd ~/blogsplitter/frontend

tar -xzf ../frontend-build.tar.gz

mkdir -p .next/standalone/frontend/.next

cp -r .next/static .next/standalone/frontend/.next/
cp -r public .next/standalone/frontend/

pm2 restart blogsplitter-frontend
```

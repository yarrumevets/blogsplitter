⚠️ NO ACTUAL SETUP STEPS TO FOLLOW HERE. THIS IS WHAT WAS DONE ⚠️

# Next.js

## Next.js Initialization Log

npx create-next-app@latest .
Need to install the following packages:
create-next-app@16.3.3
Ok to proceed? (y) y

✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … No / Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
✔ What import alias would you like configured? … @/\*
✔ Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? … No / Yes
Creating a new Next.js app in /Users/<me>/blogsplitter/frontend.

Using npm.

Initializing project with template: app

Installing dependencies:

- next
- react
- react-dom

Installing devDependencies:

- @types/node
- @types/react
- @types/react-dom
- babel-plugin-react-compiler
- eslint
- eslint-config-next
- typescript

npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE package: 'eslint-visitor-keys@5.0.1',
npm warn EBADENGINE required: { node: '^20.19.0 || ^22.13.0 || >=24' },
npm warn EBADENGINE current: { node: 'v23.6.0', npm: '10.9.2' }
npm warn EBADENGINE }
npm warn deprecated eslint@9.39.5: This version is no longer supported. Please see https://eslint.org/version-support for other options.

added 348 packages, and audited 349 packages in 11s

142 packages are looking for funding
run `npm fund` for details

found 0 vulnerabilities

Generating route types...
✓ Types generated successfully

Success! Created frontend at /Users/<me>/blogsplitter/frontend

# TypeScript

Postgres types:
npm install -D @types/pg
npm install -D @types/express

created `tsconfig.json` in `/api`:

```
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

Updated package.json:

```
{
  ...
  "scripts": {
    "dev": "tsx src/server.ts"
  },
  ...
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/node": "^24.0.0",
    "@types/pg": "^8.23.1",
    "tsx": "^4.20.0",
    "typescript": "^5.9.0"
  }
}

```

## Test POST endpoint

````curl -X POST http://localhost:3949/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test post","body_html":"<p>Hello world</p>"}'
{"id":1,"user_id":1,"title":"Test post","body_html":"<p>Hello world</p>","created_at":"2026-08-26T06:05:11.590Z"}%   ```

````

Check in psql:
`SELECT \* FROM posts;`

Should give:

````
blogsplitter=# select * from posts;
 id | user_id |   title   |     body_html      |          created_at
----+---------+-----------+--------------------+-------------------------------
  1 |       1 | Test post | <p>Hello world</p> | 2026-08-25 23:05:11.590908-07
(1 row)```
````

Fetch:

`@curl http://localhost:3949/posts`

## 🪣 S3

npm install @aws-sdk/client-s3 multer
npm install -D @types/multer

created `src/s3.ts` and `src/routes/uploads.ts`

### Create S3 bucket:

- create bucket with defaults
- create IAM user with: programmatic access
- create access key under Security Credentials
- Attach policy: JSON:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

- 🔄 Refresh policies in the user page and select.
- Create user!
- Add the `access key` and `secret access key` to `api/.env`

- Bucket - block public access - edit - uncheck all - save
- Bucket - policies - edit:

```
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

### Test upload route:

```
`curl -X POST http://localhost:3949/uploads \
 -F "image=@/full/path/to/test-image.jpg"
```

curl -X POST http://localhost:3949/uploads \
 -F "image=@/Users/steve/projects/blogsplitter/api/public/images/logo.svg"

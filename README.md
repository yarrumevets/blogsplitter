# 🪓 blogsplitter 🦫

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [License](#license)

Blog Splitter creates query-driven blogs from independent posts, turning blogs into dynamic views of content rather than fixed containers.

## Overview 🦅

Blog Splitter creates query-driven blogs from independent posts.

## Features

Independent posts, query-driven blogs, HTML content, and S3-backed images.

## Tech Stack 🥞

Next.js, Express, PostgreSQL, and AWS S3.

## Installation

Install dependencies separately in `/frontend` and `/api` with `npm install`.

PostgreSQL setup instructions are available in [`docs/setup/Postgres.md`](docs/setup/Postgres.md).

## Usage 🏃‍♂️‍➡️

Run the frontend and API locally, then create and retrieve posts through the app.

From the root folder you can run `npm run dev` to start both servers.

## Configuration 🔧

Environment variables will handle database, API, and S3 configuration.

## Project Structure

`/frontend` contains the Next.js app and `/api` contains the Express backend.

## License 🪪

This project is licensed under the MIT License. See the `LICENSE` file for details.

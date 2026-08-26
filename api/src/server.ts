import express from "express";
import "dotenv/config";
import { Pool } from "pg";

const PORT = Number(process.env.PORT);
const NODE_ENV = process.env.NODE_ENV;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT} (${NODE_ENV})`);
});

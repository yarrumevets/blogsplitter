import express from "express";
import "dotenv/config";

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Health check.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT} (${NODE_ENV})`);
});

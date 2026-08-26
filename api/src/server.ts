import express from "express";
import "dotenv/config";

import healthRouter from "./routes/health.js";
import uploadsRouter from "./routes/uploads.js";
import postsRouter from "./routes/posts.js";

const PORT = Number(process.env.PORT);
const NODE_ENV = process.env.NODE_ENV;

const app = express();
app.use(express.json());

// Routes
app.use("/health", healthRouter);
app.use("/uploads", uploadsRouter);
app.use("/posts", postsRouter);

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT} (${NODE_ENV})`);
});

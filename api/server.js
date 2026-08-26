import express from "express";

const app = express();
const PORT = 3949;
app.use(express.json());
app.use(express.static("public"));

// Health check.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

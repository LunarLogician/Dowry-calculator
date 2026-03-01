import express from "express";
import cors from "cors";
import { calculateDowry } from "./routes/calculate.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Calculate endpoint ────────────────────────────────────────────────────
app.post("/api/calculate", (req, res) => {
  try {
    const result = calculateDowry(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ── 404 catch ─────────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`\n  ✓ Dowry Calc API running at http://localhost:${PORT}\n`);
});

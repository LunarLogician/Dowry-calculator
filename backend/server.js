import express from "express";
import cors from "cors";
import { calculateDowry } from "./routes/calculate.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Allow the production frontend URL (set FRONTEND_URL on Railway) +
// localhost for local development.
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dowry-calculator-two.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl / Postman)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
  })
);
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

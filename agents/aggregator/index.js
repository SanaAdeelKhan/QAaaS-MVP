// index.js - Aggregator Agent

import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6003;

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", agent: "AggregatorAgent" });
});

/**
 * Aggregate results
 * Request body: { results: [ { agent: "unitTest", status: "success", output: "..." }, ... ] }
 */
app.post("/aggregate", (req, res) => {
  const { results } = req.body;

  if (!results || !Array.isArray(results)) {
    return res.status(400).json({ error: "results array is required" });
  }

  // Summarize results
  const summary = results.map(r => {
    return `Agent: ${r.agent}, Status: ${r.status}, Output: ${r.output?.substring(0, 100)}...`;
  });

  res.json({
    status: "aggregated",
    summary,
    raw: results
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Aggregator Agent running on http://localhost:${PORT}`);
});

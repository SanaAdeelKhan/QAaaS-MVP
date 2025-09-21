// UnitTest Agent
const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
app.use(bodyParser.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", agent: "unitTest" });
});

/**
 * Run unit tests for a given repo path
 * Request body: { repoPath: "/absolute/path/to/repo" }
 */
app.post("/run-tests", (req, res) => {
  const { repoPath } = req.body;

  if (!repoPath) {
    return res.status(400).json({ error: "repoPath is required" });
  }

  console.log(`⚡ Running unit tests in: ${repoPath}`);

  // Run tests (default: npm test)
  exec("npm test --silent", { cwd: repoPath }, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Test execution failed: ${error.message}`);
      return res.json({
        status: "failed",
        error: error.message,
        output: stderr.toString()
      });
    }

    res.json({
      status: "success",
      output: stdout.toString()
    });
  });
});

// Start the agent service
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 UnitTest Agent running on http://localhost:${PORT}`);
});

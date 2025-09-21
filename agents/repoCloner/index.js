// index.js - RepoClonerAgent

import express from "express";
import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

class RepoClonerAgent {
  constructor() {
    this.workDir = process.env.REPO_WORKDIR || path.join(process.cwd(), "repos");
    this.timeout = Number(process.env.TIMEOUT_MS || 300000);
    this.port = Number(process.env.REPOCLONER_PORT || 6001);

    this.coralSSEUrl = process.env.CORAL_SSE_URL_REPOCLONER || process.env.CORAL_SSE_URL;
    this.coralAgentId = process.env.CORAL_AGENT_ID || "repoCloner_agent";

    // Ensure working directory exists
    if (!fs.existsSync(this.workDir)) fs.mkdirSync(this.workDir, { recursive: true });
  }

  // Clone a repository
  async cloneRepository({ repoUrl, branch = "main" }) {
    if (!repoUrl) throw new Error("repoUrl is required");

    const targetDir = path.join(this.workDir, `${Date.now()}`);

    try {
      await execAsync(`git clone --branch ${branch} ${repoUrl} "${targetDir}"`, {
        timeout: this.timeout,
      });
      return { repoUrl, branch, targetDir };
    } catch (err) {
      throw new Error(`Git clone failed: ${err.stderr || err.message}`);
    }
  }

  // Optional: Register agent heartbeat/status with Coral SSE
  async sendHeartbeat() {
    if (!this.coralSSEUrl) {
      console.log("⚠️  CORAL_SSE_URL not set, skipping heartbeat");
      return;
    }

    try {
      const res = await fetch(this.coralSSEUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: this.coralAgentId,
          agentType: "RepoCloner",
          port: this.port,
          status: "UP",
        }),
      });

      if (res.ok) console.log(`✅ Heartbeat sent for ${this.coralAgentId}`);
      else console.log(`⚠️ Heartbeat failed: ${res.statusText}`);
    } catch (err) {
      console.error("❌ Coral heartbeat error:", err.message);
    }
  }

  // Start Express server
  startServer() {
    const app = express();
    app.use(express.json());

    // Health endpoint
    app.get("/health", (req, res) => {
      res.json({ status: "ok", agent: "RepoClonerAgent" });
    });

    // Clone endpoint
    app.post("/clone", async (req, res) => {
      try {
        const result = await this.cloneRepository(req.body);
        res.json({ success: true, result });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.listen(this.port, async () => {
      console.log(`🚀 RepoClonerAgent running on http://localhost:${this.port}`);

      // Optional: send initial heartbeat on startup
      await this.sendHeartbeat();

      // Optional: repeat heartbeat every 60 seconds
      if (this.coralSSEUrl) {
        setInterval(() => this.sendHeartbeat(), 60000);
      }
    });
  }
}

// Instantiate and start the agent
const agent = new RepoClonerAgent();
agent.startServer();

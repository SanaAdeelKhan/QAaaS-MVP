// src/api.js
export const AGENTS = [
  "repoCloner",
  "unitTest",
  "integration",
  "security",
  "fuzz",
  "voiceQA",
  "mistralBugReasoning",
  "aggregator",
  "interface"
];

const BASE_URL = "http://localhost:5555"; // Coral server

export async function fetchAgentStatus() {
  try {
    const response = await fetch(`${BASE_URL}/agents/status`);
    if (!response.ok) throw new Error("Cannot fetch agent status");
    return response.json(); // { agentName: "UP"/"DOWN" }
  } catch (err) {
    console.error(err);
    return AGENTS.reduce((acc, a) => ({ ...acc, [a]: "DOWN" }), {});
  }
}

export async function executeAgentCommand(agentName, command) {
  try {
    const response = await fetch(`${BASE_URL}/agents/${agentName}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command })
    });
    if (!response.ok) throw new Error("Command failed");
    return response.json(); // { output: "..." }
  } catch (err) {
    console.error(err);
    return { output: "Error executing command" };
  }
}

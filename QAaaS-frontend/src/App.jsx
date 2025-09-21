// frontend/src/App.jsx
import { useEffect, useState, useRef } from "react";
import "./App.css";

const agentsList = [
  "repoCloner", "unitTest", "integration", "security",
  "fuzz", "voiceQA", "mistralBugReasoning", "aggregator", "interface"
];

function App() {
  const [agents, setAgents] = useState(
    agentsList.map(name => ({ name, status: "DOWN", output: "" }))
  );
  const outputRef = useRef(null);

  useEffect(() => {
    const evtSource = new EventSource("http://localhost:5556/events");

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAgents(data.agents);

      // Auto scroll
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    };

    return () => {
      evtSource.close();
    };
  }, []);

  const clearLogs = () => {
    setAgents(prev =>
      prev.map(agent => ({ ...agent, output: "" }))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-3xl font-bold mb-4 text-center">QAaaS Live Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map(agent => (
          <div key={agent.name} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">{agent.name}</h2>
              <span
                className={`px-2 py-1 rounded-full text-white font-bold ${
                  agent.status === "UP" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {agent.status}
              </span>
            </div>
            <div
              ref={outputRef}
              className="bg-gray-100 p-2 h-24 overflow-y-auto text-sm font-mono rounded"
            >
              {agent.output}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
}

export default App;

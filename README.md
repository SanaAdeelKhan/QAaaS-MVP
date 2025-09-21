Here’s a clean and concise **README.md** for your QAaaS-MVP project:

````markdown
# QAaaS-MVP

**QAaaS-MVP** is a multi-agent system built for automated QA (Quality Assurance) tasks. It consists of several independent agents that can be run locally or integrated with Coral Protocol for orchestration.

---

## Agents

| Agent Name     | Description                                               | Port |
|----------------|-----------------------------------------------------------|------|
| `repoCloner`   | Clones Git repositories (public or private)              | 6001 |
| `unitTest`     | Runs automated unit tests on cloned repositories         | 5002 |
| `aggregator`   | Aggregates results from multiple agents                  | 5003 |

---

## Features

- Clone public or private Git repositories.
- Run unit tests automatically on cloned repos.
- Aggregate results from multiple agents.
- Optional Coral SSE heartbeat for agent registration and monitoring.

---

## Requirements

- Node.js >= 18
- Git
- npm (Node Package Manager)
- Optional: Coral Protocol server for agent orchestration

---

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/SanaAdeelKhan/QAaaS-MVP.git
   cd QAaaS-MVP
````

2. Install dependencies for each agent:

   ```bash
   cd Agents/repoCloner
   npm install
   cd ../unitTest
   npm install
   cd ../aggregator
   npm install
   ```

3. Configure environment variables using `.env` files:

   ```env
   # Example for repoCloner
   REPO_WORKDIR=./repos
   TIMEOUT_MS=300000
   REPOCLONER_PORT=6001
   CORAL_SSE_URL=http://localhost:5555
   GITHUB_TOKEN=your_github_token
   ```

---

## Running Agents

### RepoCloner

```bash
cd Agents/repoCloner
node index.js
```

### UnitTest

```bash
cd Agents/unitTest
node index.js
```

### Aggregator

```bash
cd Agents/aggregator
node index.js
```

---

## Notes

* If you are using **public repositories**, `GITHUB_TOKEN` is not required.
* Ensure your Coral server is running if you want agents to register and send heartbeats.
* `.gitignore` is used to prevent `node_modules` and sensitive `.env` files from being committed.

---
___________________________________________________________________________________________________________________________________________________________________________________________________________________

# Multi Agent Demo

> [!TIP]
> Updated for Coral Server v1

## Prerequisites

```bash
./check-dependencies.sh
```

This script will automatically check for valid versions of all prerequisites.

## Running Coral Server

First, make sure you have pulled the coral-server submodule:
```bash
git submodule init
git submodule update
```

Now, we can cd into the coral-server folder, and start it.

```bash
cd coral-server
REGISTRY_FILE_PATH="../registry.toml" ./gradlew run
```

> [!NOTE]
> We use the `REGISTRY_FILE_PATH` environment variable to tell Coral Server where our custom `registry.toml` is.

## Running Coral Studio

```bash
npx @coral-protocol/coral-studio
```

We can then visit Coral Studio at [http://localhost:3000/](http://localhost:3000/)

# What next?
Check out our [docs](https://docs.coralprotocol.org/) for more information on how Coral Studio works, how to write agents that work with Coral, and using Coral in your applications.

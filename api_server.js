import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetchFromGitHub } from "./github.js";

// Import MCP tools
import { helloTool } from "./tools/hello.js";
import { listReposTool } from "./tools/listRepos.js";
import { listIssuesTool } from "./tools/listIssues.js";
import { createIssueTool } from "./tools/createIssue.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const toolsRegistry = {
  [helloTool.name]: helloTool,
  [listReposTool.name]: listReposTool,
  [listIssuesTool.name]: listIssuesTool,
  [createIssueTool.name]: createIssueTool,
};

// 1. Get authenticated user profile
app.get("/api/user", async (req, res) => {
  try {
    const user = await fetchFromGitHub("/user");
    res.json({
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. List repositories
app.get("/api/repos", async (req, res) => {
  try {
    const { username } = req.query;
    let endpoint = "/user/repos?sort=updated&per_page=100";
    if (username) {
      endpoint = `/users/${username}/repos?sort=updated&per_page=100`;
    }

    const repos = await fetchFromGitHub(endpoint);
    const formatted = repos.map((r) => ({
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      owner: r.owner?.login,
      description: r.description || "No description provided.",
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      open_issues_count: r.open_issues_count,
      language: r.language || "Plain Text",
      updated_at: r.updated_at,
      private: r.private,
    }));

    res.json({ repos: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. List issues for a repository
app.get("/api/issues", async (req, res) => {
  try {
    const { owner, repo, state = "all" } = req.query;
    if (!owner || !repo) {
      return res.status(400).json({ error: "owner and repo parameters are required" });
    }

    const issues = await fetchFromGitHub(`/repos/${owner}/${repo}/issues?state=${state}&per_page=100`);
    const formatted = issues.map((i) => ({
      id: i.id,
      number: i.number,
      title: i.title,
      body: i.body || "",
      state: i.state,
      html_url: i.html_url,
      created_at: i.created_at,
      user: {
        login: i.user?.login,
        avatar_url: i.user?.avatar_url,
      },
      comments: i.comments,
      pull_request: !!i.pull_request,
    }));

    res.json({ issues: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Create a new issue
app.post("/api/issues", async (req, res) => {
  try {
    const { owner, repo, title, body } = req.body;
    if (!owner || !repo || !title) {
      return res.status(400).json({ error: "owner, repo, and title are required" });
    }

    const result = await createIssueTool.run({ owner, repo, title, body: body || "" });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. List available MCP tools metadata
app.get("/api/mcp/tools", (req, res) => {
  const tools = Object.values(toolsRegistry).map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  }));
  res.json({ tools });
});

// 6. Execute an MCP tool dynamically
app.post("/api/mcp/execute", async (req, res) => {
  try {
    const { toolName, params } = req.body;
    const tool = toolsRegistry[toolName];
    if (!tool) {
      return res.status(404).json({ error: `Tool '${toolName}' not found.` });
    }

    const result = await tool.run(params || {});
    res.json({ success: true, toolName, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GitHub Dashboard API Server running on http://localhost:${PORT}`);
});

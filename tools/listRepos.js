import { z } from "zod";
import { fetchFromGitHub } from "../github.js";

export const listReposTool = {
  name: "listRepos",
  description: "List all public repositories for a given GitHub username.",
  inputSchema: { username: z.string().min(1) },
  async run({ username }) {
    try {
      const repos = await fetchFromGitHub(`/users/${username}/repos`);
      if (!repos.length)
        return { content: [{ type: "text", text: `📦 No repositories found for **${username}**.` }] };

      const text = `### 📦 Repositories for **${username}**\n\n` +
        repos.map(r => `- 📁 **${r.name}**\n  - 📝 ${r.description || "No description"}\n  - 🔗 [View Repo](${r.html_url})`).join("\n\n");

      return { content: [{ type: "text", text }] };
    } catch (err) {
      return { content: [{ type: "error", text: `❌ Failed to fetch repos: ${err.message}` }] };
    }
  },
};

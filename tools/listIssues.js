import { z } from "zod";
import { fetchFromGitHub } from "../github.js";

export const listIssuesTool = {
  name: "listIssues",
  description: "List all open issues for a given repository.",
  inputSchema: { owner: z.string().min(1), repo: z.string().min(1) },
  async run({ owner, repo }) {
    try {
      const issues = await fetchFromGitHub(`/repos/${owner}/${repo}/issues`);
      if (!issues.length)
        return { content: [{ type: "text", text: `📭 No open issues found for **${owner}/${repo}**.` }] };

      const text = `### 📬 Open Issues for **${owner}/${repo}**\n\n` +
        issues.map(i => `- 📝 **${i.title}**\n  - 🔗 [View Issue](${i.html_url})\n  - State: ${i.state}`).join("\n\n");

      return { content: [{ type: "text", text }] };
    } catch (err) {
      return { content: [{ type: "error", text: `❌ Failed to fetch issues: ${err.message}` }] };
    }
  },
};

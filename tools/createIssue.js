import { z } from "zod";
import { fetchFromGitHub } from "../github.js";

export const createIssueTool = {
  name: "createIssue",
  description: "Create a new GitHub issue in a repository.",
  inputSchema: {
    owner: z.string().min(1),
    repo: z.string().min(1),
    title: z.string().min(1),
    body: z.string().optional(),
  },
  async run({ owner, repo, title, body }) {
    try {
      const issue = await fetchFromGitHub(`/repos/${owner}/${repo}/issues`, {
        method: "POST",
        body: JSON.stringify({ title, body }),
      });
      return {
        content: [{
          type: "text",
          text: `✅ Issue created successfully!\n- 🔹 Title: ${issue.title}\n- 🔗 [View Issue](${issue.html_url})`,
        }],
      };
    } catch (err) {
      return { content: [{ type: "error", text: `❌ Failed to create issue: ${err.message}` }] };
    }
  },
};

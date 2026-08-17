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
      
      // Return the response in the expected format with content type 'text'
      return {
        content: [{
          type: "text",
          text: `✅ Issue created successfully!\n- 🔹 Title: ${issue.title}\n- 🔗 [View Issue](${issue.html_url})`
        }]
      };
    } catch (err) {
      // Return error in the expected format
      return {
        content: [{
          type: "text",
          text: `❌ Failed to create issue: ${err.message}`
        }]
      };
    }
  },
};

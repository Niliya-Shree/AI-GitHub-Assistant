import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  throw new Error("❌ Missing GITHUB_TOKEN in .env");
}

/**
 * Generic helper to call GitHub REST API.
 * @param {string} endpoint - GitHub API endpoint (e.g., '/user', '/users/USERNAME/repos')
 * @param {object} options - Optional fetch options (method, body, etc.)
 */
export async function fetchFromGitHub(endpoint, options = {}) {
  const url = `https://api.github.com${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${GITHUB_TOKEN}`,
      "Accept": "application/vnd.github+json",
      "User-Agent": "github-mcp-server",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${errorText}`);
  }

  return response.json();
}

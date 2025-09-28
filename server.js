import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import all tools
import { helloTool } from "./tools/hello.js";
import { listReposTool } from "./tools/listRepos.js";
import { listIssuesTool } from "./tools/listIssues.js";
import { createIssueTool } from "./tools/createIssue.js";

const server = new McpServer({ name: "github-mcp", version: "1.0.0" });

// Register tools
[helloTool, listReposTool, listIssuesTool, createIssueTool].forEach(tool => {
  server.registerTool(tool.name, {
    description: tool.description,
    inputSchema: tool.inputSchema,
  }, tool.run);
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("🚀 MCP server running (github-mcp)");

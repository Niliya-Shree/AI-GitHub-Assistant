import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const run = async () => {
  const transport = new StdioClientTransport({ command: "node", args: ["server.js"] });
  const client = new Client({ name: "test-client", version: "1.0.0" });

  await client.connect(transport);
  console.log("✅ Client connected to server");

  // Step 1: List all tools
  const tools = await client.listTools();
  console.log("🛠️ Tools from server:", tools);

  // Step 2: Call each tool

  // Hello Tool
  const hello = await client.callTool({ name: "hello", arguments: { name: "Niliya" } });
  console.log("📩 hello output:", hello.content[0].text);

  // listRepos Tool
  const repos = await client.callTool({ name: "listRepos", arguments: { username: "Niliya-Shree" } });
  console.log("📩 listRepos output:\n", repos.content[0].text);

  // listIssues Tool
  const issues = await client.callTool({ name: "listIssues", arguments: { owner: "Niliya-Shree", repo: "countdown" } });
  console.log("📩 listIssues output:\n", issues.content[0].text);

  // createIssue Tool
  const issue = await client.callTool({
    name: "createIssue",
    arguments: { owner: "Niliya-Shree", repo: "countdown", title: "Test Issue MCP", body: "Testing createIssue tool." }
  });
  console.log("📩 createIssue output:\n", issue.content[0].text);

  await client.close();
  console.log("🔌 Client closed");
};

run().catch(console.error);

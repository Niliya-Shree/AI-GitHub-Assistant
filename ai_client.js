import { exec } from "child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * Run TinyLlama with a given prompt and return the response.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const runTinyLlama = (prompt) => {
  return new Promise((resolve, reject) => {
    console.log('\n--- Sending to TinyLlama ---');
    console.log('Prompt length:', prompt.length, 'characters');
    
    // Add a timeout to prevent hanging
    const timeout = setTimeout(() => {
      reject(new Error('TinyLlama request timed out after 60 seconds'));
    }, 60000);

    // Prepare the command with a simple prompt
    const command = `ollama run tinyllama "${prompt.replace(/"/g, '\\"').replace(/\n/g, ' ').trim()}"`;
    console.log('Executing command:', command);

    const child = exec(command, (error, stdout, stderr) => {
      clearTimeout(timeout);
      
      if (stderr) {
        console.error('TinyLlama stderr:', stderr);
      }
      
      if (error) {
        console.error('TinyLlama error:', error);
        return reject(error);
      }
      
      console.log('--- Raw response from TinyLlama ---');
      console.log(stdout);
      console.log('----------------------------------');
      
      // If the response is empty, return a default response
      const trimmed = stdout.trim();
      if (!trimmed) {
        console.log('Empty response, using default');
        return resolve('{"tool": "create_issue", "params": {"title": "Test AI Issue", "repo": "countdown"}}');
      }
      
      // Try to extract JSON from the response
      const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resolve(jsonMatch[0]);
      } else {
        console.log('No JSON found in response, using default');
        resolve('{"tool": "create_issue", "params": {"title": "Test AI Issue", "repo": "countdown"}}');
      }
    });

    // Log if the process exits unexpectedly
    child.on('exit', (code, signal) => {
      console.log(`TinyLlama process exited with code ${code} and signal ${signal}`);
    });
  });
};

const run = async () => {
  let client;
  let transport;
  
  try {
    console.log('Starting MCP client...');
    
    // Connect to MCP server
    transport = new StdioClientTransport({ 
      command: 'node', 
      args: ['server.js'],
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false
    });
    
    console.log('Creating MCP client...');
    client = new Client({ name: "ai-client", version: "1.0.0" });
    
    console.log('Connecting to server...');
    await client.connect(transport);
    console.log('Successfully connected to MCP server');

    // Example user prompt (can be changed dynamically)
    const userPrompt = "Create a new issue in repo countdown called 'Test AI Issue'";
    try {
      // Skip AI generation and use direct JSON
      console.log('Skipping AI generation, using direct JSON...');
      const toolName = 'createIssue';
      const toolParams = {
        owner: 'Niliya-Shree',
        repo: 'blogger',
        title: 'Test AI Issue',
        body: 'This issue was created by the AI GitHub Assistant'
      };
      
      console.log(`Calling tool '${toolName}' with params:`, JSON.stringify(toolParams, null, 2));
      
      // Call the tool using the correct method
      const result = await client.callTool({
        name: toolName,
        arguments: toolParams
      });
      
      if (typeof result === 'object') {
        console.log('Result:', JSON.stringify(result, null, 2));
      } else {
        console.log('Result:', result);
      }
    } catch (error) {
      console.error("Error processing tool call:", error);
    }
  } catch (error) {
    console.error('Error in MCP client:', error);
  } finally {
    if (client) {
      try {
        await client.close();
      } catch (e) {
        console.error('Error closing client:', e);
      }
    }
    console.log('MCP client stopped');
  }
};

run().catch(error => {
  console.error('Error in MCP client:', error);
  process.exit(1);
});

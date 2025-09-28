import { z } from "zod";

export const helloTool = {
  name: "hello",
  description: "Returns a hello world greeting",
  inputSchema: { name: z.string().min(1, "name is required") },
  async run(args) {
    try {
      const name = args?.name?.trim() || "World";
      return { content: [{ type: "text", text: `Hello, ${name}! 🚀` }] };
    } catch (err) {
      return { content: [{ type: "error", text: `Error: ${err.message}` }] };
    }
  },
};

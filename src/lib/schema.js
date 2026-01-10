const { z } = require('zod');

const AgentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  emoji: z.string().optional().default('🤖'),
  systemPrompt: z.string().min(10, "System Prompt must be at least 10 characters"),
  rules: z.array(z.string()).optional().default([]),
  tools: z.array(z.string()).optional().default([]),
  description: z.string().optional()
});

module.exports = { AgentSchema };

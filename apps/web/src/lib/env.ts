import { z } from 'zod';

const serverEnvSchema = z.object({
  API_BASE_URL: z.string().url().default('http://localhost:8081/api'),
  DEFAULT_TEAM_SLUG: z.string().min(1).default('cats'),
});

export const env = serverEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  DEFAULT_TEAM_SLUG: process.env.DEFAULT_TEAM_SLUG,
});

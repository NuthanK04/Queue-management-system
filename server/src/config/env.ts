import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  PORT: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
});

const envSource =
  process.env.GITHUB_ACTIONS === "true"
    ? {
        ...process.env,
        DATABASE_URL:
          process.env.DATABASE_URL ||
          "postgresql://test:test@localhost:5432/test",
        JWT_SECRET:
          process.env.JWT_SECRET ||
          "github-actions-secret-12345",
      }
    : {
        ...process.env,
        DATABASE_URL:
          process.env.DATABASE_URL ||
          "postgresql://test:test@localhost:5432/test",
        JWT_SECRET:
          process.env.JWT_SECRET ||
          "github-actions-secret-12345",
      };

export const env = envSchema.parse(envSource);
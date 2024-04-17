import { z } from 'zod'

const envSchema = z.object({
  API_BASE_URL: z.string().url(),
  REDIS_URI: z.string(),
  PORT: z.string(),
})

export const env = envSchema.parse(process.env)

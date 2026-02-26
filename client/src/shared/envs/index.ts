import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BACKEND_URL: z.string().url(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables')
}

export const Envs = parsed.data

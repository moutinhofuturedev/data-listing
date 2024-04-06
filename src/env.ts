import { z } from 'zod'

const envApiUrl = z.object({
  VITE_API_URL: z.string().url(),
})

export const env = envApiUrl.parse(import.meta.env)

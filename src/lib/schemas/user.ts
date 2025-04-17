import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(2).max(50),
  password: z.string().min(8),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof userSchema>

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = userSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export type RegisterInput = z.infer<typeof registerSchema> 
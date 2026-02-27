import { z } from 'zod'

export interface Author {
  id: string
  name: string
  createdAt: string
  _count?: { books: number }
}

export const authorCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
})

export type AuthorCreateDto = z.infer<typeof authorCreateSchema>

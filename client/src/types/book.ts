import { z } from 'zod'
import type { Author } from './author'
import type { Category } from './category'

export interface Book {
  id: string
  title: string
  isbn: string | null
  publishedYear: number | null
  authors: Author[]
  categories: Category[]
  _count?: { copies: number }
  createdAt: string
  updatedAt: string
}

export const bookCreateSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  isbn: z.string().optional(),
  publishedYear: z.coerce.number().int().min(1000).max(2100).optional().or(z.literal('')),
  authorIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
})

export type BookCreateDto = z.infer<typeof bookCreateSchema>

export const bookUpdateSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  isbn: z.string().optional(),
  publishedYear: z.coerce.number().int().min(1000).max(2100).optional().or(z.literal('')),
  authorIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
})

export type BookUpdateDto = z.infer<typeof bookUpdateSchema>

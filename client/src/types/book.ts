import { z } from 'zod'

export interface Book {
  id: string
  title: string
  author: string
  isbn: string | null
  totalCopies: number
  availableCopies: number
  createdAt: string
  updatedAt: string
}

export const bookCreateSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  author: z.string().min(1, 'El autor es requerido'),
  isbn: z.string().optional(),
  totalCopies: z.coerce.number().int().min(1, 'Mínimo 1 copia').default(1),
})

export type BookCreateDto = z.infer<typeof bookCreateSchema>

export const bookUpdateSchema = z.object({
  title: z.string().min(1, 'El título es requerido').optional(),
  author: z.string().min(1, 'El autor es requerido').optional(),
  isbn: z.string().optional(),
  totalCopies: z.coerce.number().int().min(1, 'Mínimo 1 copia').optional(),
})

export type BookUpdateDto = z.infer<typeof bookUpdateSchema>

import { z } from 'zod'

export interface Category {
  id: string
  name: string
  prefix: string
  createdAt: string
  _count?: { books: number }
}

export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  prefix: z.string().length(3, 'El prefijo debe tener exactamente 3 caracteres'),
})

export type CategoryCreateDto = z.infer<typeof categoryCreateSchema>

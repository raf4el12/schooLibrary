import { z } from 'zod'
import type { Book } from './book'

export type CopyCondition = 'NEW' | 'GOOD' | 'FAIR' | 'DAMAGED'

export interface BookCopy {
  id: string
  bookId: string
  inventoryCode: string
  condition: CopyCondition
  isAvailable: boolean
  book: Book
  createdAt: string
  updatedAt: string
}

export const bookCopyCreateSchema = z.object({
  bookId: z.string().min(1, 'Seleccione un libro'),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED']).default('GOOD'),
})

export type BookCopyCreateDto = z.infer<typeof bookCopyCreateSchema>

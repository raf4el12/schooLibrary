import { z } from 'zod'
import type { Book } from './book'
import type { Borrower } from './borrower'

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE'

export interface Loan {
  id: string
  borrowerId: string
  bookId: string
  status: LoanStatus
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
  createdAt: string
  updatedAt: string
  borrower: Borrower
  book: Book
}

export const loanCreateSchema = z.object({
  borrowerId: z.string().min(1, 'Seleccione un prestatario'),
  bookId: z.string().min(1, 'Seleccione un libro'),
  dueDate: z.string().min(1, 'La fecha de devolución es requerida'),
})

export type LoanCreateDto = z.infer<typeof loanCreateSchema>

import { z } from 'zod'
import type { Borrower } from './borrower'
import type { BookCopy } from './book-copy'

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE'

export interface Loan {
  id: string
  borrowerId: string
  bookCopyId: string
  loanedBy: string
  status: LoanStatus
  borrowedAt: string
  dueDate: string
  returnedAt: string | null
  createdAt: string
  updatedAt: string
  borrower: Borrower
  bookCopy: BookCopy
  processedBy?: { id: string; name: string; email: string }
  penalty?: Penalty | null
}

export interface Penalty {
  id: string
  borrowerId: string
  loanId: string
  reason: string
  resolved: boolean
  createdAt: string
  resolvedAt: string | null
  updatedAt: string
  borrower?: Borrower
  loan?: Loan
}

export const loanBorrowSchema = z.object({
  borrowerIdentifier: z.string().min(1, 'Seleccione un prestatario'),
  inventoryCode: z.string().min(1, 'Ingrese el código de inventario'),
})

export type LoanBorrowDto = z.infer<typeof loanBorrowSchema>

export const loanReturnSchema = z.object({
  inventoryCode: z.string().min(1, 'Ingrese el código de inventario'),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'DAMAGED']).optional(),
})

export type LoanReturnDto = z.infer<typeof loanReturnSchema>

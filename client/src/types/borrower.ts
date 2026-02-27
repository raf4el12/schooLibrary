import { z } from 'zod'

export type BorrowerType = 'STUDENT' | 'TEACHER'

export interface Borrower {
  id: string
  code: string
  name: string
  email: string | null
  grade: string | null
  type: BorrowerType
  isActive: boolean
  _count?: { loans: number; penalties: number }
  createdAt: string
  updatedAt: string
}

export const borrowerCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  grade: z.string().optional(),
  type: z.enum(['STUDENT', 'TEACHER']).default('STUDENT'),
})

export type BorrowerCreateDto = z.infer<typeof borrowerCreateSchema>

export const borrowerUpdateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  grade: z.string().optional(),
  type: z.enum(['STUDENT', 'TEACHER']).optional(),
})

export type BorrowerUpdateDto = z.infer<typeof borrowerUpdateSchema>

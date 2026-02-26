import { z } from 'zod'

export enum Role {
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
}

export interface User {
  id: string
  email: string
  name: string
  role: Role
  createdAt: string
  updatedAt: string
}

export const userCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.nativeEnum(Role).default(Role.LIBRARIAN),
})

export type UserCreateDto = z.infer<typeof userCreateSchema>

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  email: z.string().email('Email inválido').optional(),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  role: z.nativeEnum(Role).optional(),
})

export type UserUpdateDto = z.infer<typeof userUpdateSchema>

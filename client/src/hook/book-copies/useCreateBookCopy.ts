import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { BookCopy, BookCopyCreateDto } from '../../types/book-copy'

export function useCreateBookCopy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BookCopyCreateDto) => {
      return ApiBackend.post<BookCopy>('/book-copies', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-copies'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Ejemplar registrado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al registrar el ejemplar')
    },
  })
}

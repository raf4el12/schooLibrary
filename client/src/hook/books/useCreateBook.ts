import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Book, BookCreateDto } from '../../types/book'

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BookCreateDto) => {
      return ApiBackend.post<Book>('/books', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Libro creado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el libro')
    },
  })
}

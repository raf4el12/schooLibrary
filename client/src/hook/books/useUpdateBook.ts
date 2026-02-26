import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Book, BookUpdateDto } from '../../types/book'

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BookUpdateDto }) => {
      return ApiBackend.put<Book>(`/books/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Libro actualizado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el libro')
    },
  })
}

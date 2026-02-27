import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { BookCopy } from '../../types/book-copy'

export function useUpdateBookCopy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { condition: string } }) => {
      return ApiBackend.put<BookCopy>(`/book-copies/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-copies'] })
      toast.success('Ejemplar actualizado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el ejemplar')
    },
  })
}

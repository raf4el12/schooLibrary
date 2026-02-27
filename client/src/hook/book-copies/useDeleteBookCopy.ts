import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'

export function useDeleteBookCopy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return ApiBackend.delete(`/book-copies/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['book-copies'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Ejemplar eliminado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el ejemplar')
    },
  })
}

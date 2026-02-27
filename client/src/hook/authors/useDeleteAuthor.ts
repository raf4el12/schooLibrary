import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'

export function useDeleteAuthor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return ApiBackend.delete(`/authors/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Autor eliminado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el autor')
    },
  })
}

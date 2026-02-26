import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'

export function useDeleteBorrower() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return ApiBackend.delete(`/borrowers/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] })
      toast.success('Prestatario eliminado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar el prestatario')
    },
  })
}

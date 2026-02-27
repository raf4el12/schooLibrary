import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Penalty } from '../../types/loan'

export function useResolvePenalty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return ApiBackend.patch<Penalty>(`/penalties/${id}/resolve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penalties'] })
      queryClient.invalidateQueries({ queryKey: ['borrowers'] })
      toast.success('Penalidad resuelta exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al resolver la penalidad')
    },
  })
}

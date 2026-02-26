import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Loan } from '../../types/loan'

export function useReturnLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return ApiBackend.patch<Loan>(`/loans/${id}/return`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
      toast.success('Libro devuelto exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al devolver el libro')
    },
  })
}

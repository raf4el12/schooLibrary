import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Loan, LoanReturnDto } from '../../types/loan'

export function useReturnLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoanReturnDto) => {
      return ApiBackend.patch<Loan>('/loans/return', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['book-copies'] })
      queryClient.invalidateQueries({ queryKey: ['borrowers'] })
      queryClient.invalidateQueries({ queryKey: ['penalties'] })
      toast.success('Libro devuelto exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al devolver el libro')
    },
  })
}

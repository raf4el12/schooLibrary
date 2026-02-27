import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Loan, LoanBorrowDto } from '../../types/loan'

export function useCreateLoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoanBorrowDto) => {
      return ApiBackend.post<Loan>('/loans/borrow', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      queryClient.invalidateQueries({ queryKey: ['book-copies'] })
      queryClient.invalidateQueries({ queryKey: ['borrowers'] })
      toast.success('Préstamo creado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el préstamo')
    },
  })
}

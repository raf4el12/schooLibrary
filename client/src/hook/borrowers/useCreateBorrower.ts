import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Borrower, BorrowerCreateDto } from '../../types/borrower'

export function useCreateBorrower() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BorrowerCreateDto) => {
      return ApiBackend.post<Borrower>('/borrowers', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] })
      toast.success('Prestatario creado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el prestatario')
    },
  })
}

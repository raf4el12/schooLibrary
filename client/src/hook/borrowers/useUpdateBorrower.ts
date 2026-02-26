import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Borrower, BorrowerUpdateDto } from '../../types/borrower'

export function useUpdateBorrower() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BorrowerUpdateDto }) => {
      return ApiBackend.put<Borrower>(`/borrowers/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] })
      toast.success('Prestatario actualizado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el prestatario')
    },
  })
}

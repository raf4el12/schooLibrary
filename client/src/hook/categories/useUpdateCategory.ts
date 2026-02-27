import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Category, CategoryCreateDto } from '../../types/category'

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryCreateDto }) => {
      return ApiBackend.put<Category>(`/categories/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoría actualizada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar la categoría')
    },
  })
}

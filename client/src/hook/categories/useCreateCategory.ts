import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Category, CategoryCreateDto } from '../../types/category'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CategoryCreateDto) => {
      return ApiBackend.post<Category>('/categories', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Categoría creada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la categoría')
    },
  })
}

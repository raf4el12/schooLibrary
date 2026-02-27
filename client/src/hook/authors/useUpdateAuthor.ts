import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Author, AuthorCreateDto } from '../../types/author'

export function useUpdateAuthor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AuthorCreateDto }) => {
      return ApiBackend.put<Author>(`/authors/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Autor actualizado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el autor')
    },
  })
}

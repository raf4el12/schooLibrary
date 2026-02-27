import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import ApiBackend from '../../shared/services/api.backend'
import type { Author, AuthorCreateDto } from '../../types/author'

export function useCreateAuthor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: AuthorCreateDto) => {
      return ApiBackend.post<Author>('/authors', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] })
      toast.success('Autor creado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear el autor')
    },
  })
}

import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { User } from '../../types/user'

export function useGetUserById(userId: string | null) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      return ApiBackend.get<User>(`/users/${userId}`)
    },
    enabled: !!userId,
  })
}

import { useQuery } from '@tanstack/react-query'
import ApiBackend from '../../shared/services/api.backend'
import type { Penalty } from '../../types/loan'

export function usePenalties(resolved?: string) {
  return useQuery({
    queryKey: ['penalties', resolved],
    queryFn: async () => {
      const params = resolved ? `?resolved=${resolved}` : ''
      return ApiBackend.get<Penalty[]>(`/penalties${params}`)
    },
  })
}

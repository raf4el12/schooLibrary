import type { QueryClient } from '@tanstack/react-query'

type UpdateAction<T> =
  | { type: 'add'; item: T }
  | { type: 'update'; item: T; matchBy: keyof T }
  | { type: 'delete'; id: string | number; matchBy: keyof T }

export default function updateQueryArray<T>(
  queryClient: QueryClient,
  queryKey: string[],
  action: UpdateAction<T>
) {
  queryClient.setQueryData<T[]>(queryKey, (old) => {
    if (!old) return old
    switch (action.type) {
      case 'add':
        return [...old, action.item]
      case 'update':
        return old.map((el) =>
          el[action.matchBy] === action.item[action.matchBy]
            ? action.item
            : el
        )
      case 'delete':
        return old.filter((el) => el[action.matchBy] !== action.id)
    }
  })
}

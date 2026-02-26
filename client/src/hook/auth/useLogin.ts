import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuthContext } from '../../context/AuthContext'
import ApiBackend from '../../shared/services/api.backend'
import type { LoginDto, LoginResponse } from '../../types/auth'
import type { User } from '../../types/user'

export function useLogin() {
  const { login } = useAuthContext()

  return useMutation({
    mutationFn: async (data: LoginDto) => {
      return ApiBackend.post<LoginResponse>('/auth/login', data)
    },
    onSuccess: (data) => {
      ApiBackend.setToken(data.token)
      login(data.token, data.user as User)
      toast.success('Inicio de sesión exitoso')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al iniciar sesión')
    },
  })
}

import { useAuthContext } from '../../context/AuthContext'
import ApiBackend from '../../shared/services/api.backend'

export function useLogout() {
  const { logout } = useAuthContext()

  const handleLogout = () => {
    ApiBackend.setToken(null)
    logout()
  }

  return { logout: handleLogout }
}

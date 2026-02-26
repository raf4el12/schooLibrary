import { Envs } from '../envs'
import HttpClient from './http-client'

const API_BACKEND_URL = `${Envs.VITE_API_BACKEND_URL}/api/v1`

const ApiBackend = new HttpClient(API_BACKEND_URL)

ApiBackend.interceptResponse(async (response, context) => {
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/auth/login'
  }
  return response
})

// Restore token from localStorage on init
const savedToken = localStorage.getItem('token')
if (savedToken) {
  ApiBackend.setToken(savedToken)
}

export default ApiBackend

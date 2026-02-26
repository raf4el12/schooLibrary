import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '../../hook/auth/useLogin'
import { loginSchema, type LoginDto } from '../../types/auth'
import FormFieldError from '../commons/FormFieldError'

export default function LoginCard() {
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginDto) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        window.location.href = '/admin'
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen min-w-full bg-gray-50">
      <div className="border border-gray-200 rounded-2xl shadow-lg p-8 w-full max-w-md bg-white">
        <div className="flex flex-col items-center mb-6">
          <AutoStoriesIcon sx={{ fontSize: 48 }} className="text-blue-700 mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">SchoolLibrary</h1>
          <p className="text-gray-500 text-sm">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="admin@schoolibrary.com"
            />
            {errors.email && (
              <FormFieldError>{errors.email.message}</FormFieldError>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <FormFieldError>{errors.password.message}</FormFieldError>
            )}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50 cursor-pointer"
          >
            {loginMutation.isPending ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

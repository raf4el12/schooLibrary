import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '../../hook/auth/useLogin'
import { loginSchema, type LoginDto } from '../../types/auth'
import FormFieldError from '../commons/FormFieldError'

export default function LoginCard() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen" style={{ background: 'var(--clr-bg)' }}>

      {/* Back to landing */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 z-10 flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 transition-colors cursor-pointer md:flex hidden"
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        Volver
      </button>
      <button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 z-10 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-lg px-3 py-1.5 transition-colors cursor-pointer md:hidden"
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        Volver
      </button>

      {/* Left panel */}
      <div className="hidden md:block md:w-1/2 lg:w-[55%] relative">
        <img
          src="/school/I.E 21578.jpeg"
          alt="Escuela Bicentenario 21578"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="font-display text-3xl lg:text-4xl leading-tight mb-2">
            Escuela Bicentenario 21578
          </h2>
          <p className="text-white/60 text-sm lg:text-base max-w-md">
            Sistema de gestión bibliotecaria para la comunidad educativa de Paramonga.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-[400px]">

          {/* Logo */}
          <div className="flex justify-center items-center gap-2.5 mb-10">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                boxShadow: '0 4px 16px rgba(13,148,136,0.25)',
              }}
            >
              <MenuBookIcon sx={{ fontSize: 24, color: '#fff' }} />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-800 tracking-tight">BiblioTK</span>
              <span className="text-sm font-semibold ml-1.5" style={{ color: '#0d9488' }}>21578</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl text-slate-800 mb-1">Iniciar sesión</h1>
            <p className="text-slate-400 text-sm">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium text-slate-600">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all ${
                  errors.email ? 'border-rose-400' : 'border-slate-200'
                }`}
                placeholder="admin@schoolibrary.com"
              />
              {errors.email && (
                <FormFieldError>{errors.email.message}</FormFieldError>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium text-slate-600">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full bg-slate-50 border rounded-xl pl-4 pr-11 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all ${
                    errors.password ? 'border-rose-400' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword
                    ? <VisibilityOffIcon sx={{ fontSize: 20 }} />
                    : <VisibilityIcon sx={{ fontSize: 20 }} />
                  }
                </button>
              </div>
              {errors.password && (
                <FormFieldError>{errors.password.message}</FormFieldError>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                  boxShadow: '0 4px 12px rgba(13,148,136,0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,148,136,0.35)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,148,136,0.25)'
                }}
              >
                {loginMutation.isPending ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-400 mt-10">
            Escuela Bicentenario 21578
          </p>
        </div>
      </div>

    </div>
  )
}

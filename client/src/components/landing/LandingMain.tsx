import MenuBookIcon from '@mui/icons-material/MenuBook'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import GroupIcon from '@mui/icons-material/Group'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: <LibraryBooksIcon sx={{ fontSize: 36 }} className="text-blue-600" />,
    title: 'Catálogo digital',
    description: 'Gestiona todo tu inventario de libros con búsqueda instantánea por título, autor o ISBN.',
  },
  {
    icon: <GroupIcon sx={{ fontSize: 36 }} className="text-emerald-600" />,
    title: 'Control de prestatarios',
    description: 'Registra estudiantes y profesores con su información para un seguimiento organizado.',
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 36 }} className="text-amber-600" />,
    title: 'Préstamos y devoluciones',
    description: 'Registra préstamos, controla fechas de devolución y gestiona el estado en tiempo real.',
  },
  {
    icon: <SearchIcon sx={{ fontSize: 36 }} className="text-purple-600" />,
    title: 'Dashboard inteligente',
    description: 'Visualiza estadísticas de tu biblioteca: libros disponibles, préstamos activos y vencidos.',
  },
]

export default function LandingMain() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MenuBookIcon className="text-blue-700" />
            <span className="text-lg font-bold text-gray-800">BiblioTK</span>
            <span className="text-xs text-gray-400 font-medium">21578</span>
          </div>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/auth/login')}
          >
            Iniciar sesión
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <MenuBookIcon sx={{ fontSize: 14 }} />
          Escuela Bicentenario 21578
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          La biblioteca escolar,
          <br />
          <span className="text-blue-600">ahora digital</span>
        </h1>

        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
          BiblioTK 21578 simplifica la gestión de la biblioteca de tu escuela.
          Controla libros, préstamos y prestatarios desde un solo lugar.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth/login')}
          >
            Acceder al sistema
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
          Todo lo que necesitas para tu biblioteca
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            ¿Listo para organizar tu biblioteca?
          </h2>
          <p className="text-gray-500 mb-6">
            Inicia sesión y comienza a gestionar los recursos de la Escuela Bicentenario.
          </p>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/auth/login')}
          >
            Comenzar ahora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <MenuBookIcon sx={{ fontSize: 14 }} />
            BiblioTK 21578
          </div>
          <span>Escuela Bicentenario 21578</span>
        </div>
      </footer>
    </div>
  )
}

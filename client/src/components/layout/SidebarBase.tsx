import MenuBookIcon from '@mui/icons-material/MenuBook'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import CategoryIcon from '@mui/icons-material/Category'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GroupIcon from '@mui/icons-material/Group'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import GavelIcon from '@mui/icons-material/Gavel'
import LogoutIcon from '@mui/icons-material/Logout'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useLogout } from '../../hook/auth/useLogout'
import LoadingPage from '../commons/LoadingPage'

const menuSections = [
  {
    title: 'General',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { label: 'Autores', href: '/admin/authors', icon: <PersonIcon sx={{ fontSize: 20 }} /> },
      { label: 'Categorías', href: '/admin/categories', icon: <CategoryIcon sx={{ fontSize: 20 }} /> },
      { label: 'Libros', href: '/admin/books', icon: <LibraryBooksIcon sx={{ fontSize: 20 }} /> },
      { label: 'Ejemplares', href: '/admin/book-copies', icon: <ContentCopyIcon sx={{ fontSize: 20 }} /> },
    ],
  },
  {
    title: 'Circulación',
    items: [
      { label: 'Prestatarios', href: '/admin/borrowers', icon: <GroupIcon sx={{ fontSize: 20 }} /> },
      { label: 'Préstamos', href: '/admin/loans', icon: <SwapHorizIcon sx={{ fontSize: 20 }} /> },
      { label: 'Penalidades', href: '/admin/penalties', icon: <GavelIcon sx={{ fontSize: 20 }} /> },
    ],
  },
]

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  LIBRARIAN: 'Bibliotecario',
}

export default function SidebarBase() {
  const location = useLocation()
  const { user, isLoading } = useAuthContext()
  const { logout } = useLogout()

  if (isLoading) return <LoadingPage />

  if (!user && !isLoading) {
    window.location.href = '/auth/login'
    return <LoadingPage />
  }

  const initials = user?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 flex flex-col z-10"
      style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3a 50%, #0a1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Brand ── */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
            boxShadow: '0 0 20px rgba(21,101,192,0.3)',
          }}
        >
          <MenuBookIcon sx={{ fontSize: 20, color: '#fff' }} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-bold text-white tracking-tight">BiblioTK</span>
          <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Escuela 21578
          </span>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 pt-4 pb-2 overflow-y-auto space-y-5">
        {menuSections.map((section) => (
          <div key={section.title}>
            <span
              className="block px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              {section.title}
            </span>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === '/admin'
                    ? location.pathname === '/admin'
                    : location.pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] transition-all duration-200"
                    style={
                      isActive
                        ? {
                            background: 'rgba(21,101,192,0.2)',
                            color: '#90caf9',
                            fontWeight: 600,
                            boxShadow: 'inset 0 0 0 1px rgba(21,101,192,0.25)',
                          }
                        : {
                            color: 'rgba(255,255,255,0.5)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                      }
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── User section ── */}
      <div className="px-3 pb-4 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #1565c0, #1e88e5)',
              boxShadow: '0 0 12px rgba(21,101,192,0.25)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            {initials}
          </div>
          {/* Info */}
          <div className="flex flex-col min-w-0">
            <span
              className="text-[13px] font-semibold truncate"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              {user?.name}
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: 'rgba(144,202,249,0.7)' }}
            >
              {roleLabels[user?.role ?? ''] ?? user?.role}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] transition-all duration-200 cursor-pointer"
          style={{
            color: 'rgba(255,255,255,0.4)',
            background: 'transparent',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
          }}
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

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
      { label: 'Dashboard', href: '/admin', icon: <DashboardIcon sx={{ fontSize: 19 }} /> },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { label: 'Autores', href: '/admin/authors', icon: <PersonIcon sx={{ fontSize: 19 }} /> },
      { label: 'Categorías', href: '/admin/categories', icon: <CategoryIcon sx={{ fontSize: 19 }} /> },
      { label: 'Libros', href: '/admin/books', icon: <LibraryBooksIcon sx={{ fontSize: 19 }} /> },
      { label: 'Ejemplares', href: '/admin/book-copies', icon: <ContentCopyIcon sx={{ fontSize: 19 }} /> },
    ],
  },
  {
    title: 'Circulación',
    items: [
      { label: 'Prestatarios', href: '/admin/borrowers', icon: <GroupIcon sx={{ fontSize: 19 }} /> },
      { label: 'Préstamos', href: '/admin/loans', icon: <SwapHorizIcon sx={{ fontSize: 19 }} /> },
      { label: 'Penalidades', href: '/admin/penalties', icon: <GavelIcon sx={{ fontSize: 19 }} /> },
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
      className="fixed top-0 left-0 h-screen flex flex-col z-10"
      style={{
        width: 'var(--sidebar-w)',
        background: 'linear-gradient(180deg, #16192b 0%, #1a1d32 50%, #16192b 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
            boxShadow: '0 4px 16px rgba(13,148,136,0.3)',
          }}
        >
          <MenuBookIcon sx={{ fontSize: 20, color: '#fff' }} />
        </div>
        <div className="flex flex-col leading-tight">
          <span
            className="text-[15px] font-bold tracking-tight"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            BiblioTK
          </span>
          <span
            className="text-[10px] font-medium"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Escuela 21578
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-5 pb-2 overflow-y-auto space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <span
              className="block px-3 pb-2.5 text-[10px] font-bold uppercase tracking-[0.12em]"
              style={{ color: 'rgba(255,255,255,0.22)' }}
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
                    className={`sidebar-link flex items-center gap-3 w-full px-3 py-2.5 text-[13px] ${isActive ? 'active' : ''}`}
                    style={{
                      color: isActive
                        ? '#5eead4'
                        : 'rgba(255,255,255,0.45)',
                      fontWeight: isActive ? 600 : 400,
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

      {/* User section */}
      <div
        className="px-3 pb-4 pt-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="flex items-center gap-3 px-3 py-3 rounded-xl mb-1.5"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-[13px] font-semibold truncate"
              style={{ color: 'rgba(255,255,255,0.88)' }}
            >
              {user?.name}
            </span>
            <span
              className="text-[11px] font-medium"
              style={{ color: 'rgba(94,234,212,0.6)' }}
            >
              {roleLabels[user?.role ?? ''] ?? user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="sidebar-link flex items-center gap-3 w-full px-3 py-2 text-[13px] cursor-pointer"
          style={{
            color: 'rgba(255,255,255,0.35)',
            background: 'transparent',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(225,29,72,0.1)'
            e.currentTarget.style.color = '#fb7185'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
          }}
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

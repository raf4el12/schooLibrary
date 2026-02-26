import MenuBookIcon from '@mui/icons-material/MenuBook'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LogoutIcon from '@mui/icons-material/Logout'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { Link, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useLogout } from '../../hook/auth/useLogout'
import LoadingPage from '../commons/LoadingPage'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Libros', href: '/admin/books', icon: <LibraryBooksIcon fontSize="small" /> },
  { label: 'Prestatarios', href: '/admin/borrowers', icon: <GroupIcon fontSize="small" /> },
  { label: 'Préstamos', href: '/admin/loans', icon: <SwapHorizIcon fontSize="small" /> },
]

export default function SidebarBase() {
  const location = useLocation()
  const { user, isLoading } = useAuthContext()
  const { logout } = useLogout()

  if (isLoading) return <LoadingPage />

  if (!user && !isLoading) {
    window.location.href = '/auth/login'
    return <LoadingPage />
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-10">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
        <MenuBookIcon className="text-blue-700" />
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold text-gray-800">BiblioTK</span>
          <span className="text-[10px] text-gray-400 font-medium">21578</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="px-3 py-2 text-sm text-gray-500 truncate">
          {user?.name} — {user?.role}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <LogoutIcon fontSize="small" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

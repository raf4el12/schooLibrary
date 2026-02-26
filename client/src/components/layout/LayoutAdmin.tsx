import { Outlet } from 'react-router-dom'
import SidebarBase from './SidebarBase'

export default function LayoutAdmin() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarBase />
      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto ml-64">
        <Outlet />
      </main>
    </div>
  )
}

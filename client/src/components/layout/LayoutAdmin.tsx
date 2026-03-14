import { Outlet } from 'react-router-dom'
import SidebarBase from './SidebarBase'

export default function LayoutAdmin() {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarBase />
      <main
        className="flex-1 overflow-y-auto"
        style={{
          marginLeft: 'var(--sidebar-w)',
          background: 'var(--clr-bg)',
          padding: '32px 40px',
        }}
      >
        <div className="max-w-[1280px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

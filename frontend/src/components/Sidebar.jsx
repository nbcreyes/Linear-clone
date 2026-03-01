import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useWorkspaceStore from '../store/workspaceStore'

const navItems = [
  { label: 'My Issues', path: '/issues' },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace)
  const [showInvite, setShowInvite] = useState(false)

  const handleLogout = () => {
    logout()
    clearWorkspace()
    navigate('/login')
  }

  const handleSwitchWorkspace = () => {
    clearWorkspace()
    navigate('/workspace')
  }

  return (
    <div className="w-60 h-screen bg-[#141414] border-r border-[#2e2e2e] flex flex-col select-none">

      {/* Workspace header */}
      <div className="px-4 py-3 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-[#5e5ce6] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">
              {currentWorkspace?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-white text-sm font-semibold truncate">
            {currentWorkspace?.name}
          </span>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="text-xs text-[#5e5ce6] hover:text-[#4f4dd4] transition-colors"
        >
          {showInvite ? 'Hide invite code' : 'Show invite code'}
        </button>
        {showInvite && (
          <div className="mt-2 px-2 py-1.5 bg-[#242424] rounded text-xs text-[#8a8a8a] font-mono break-all">
            {currentWorkspace?.inviteCode}
          </div>
        )}
      </div>

      {/* User info */}
      <div className="px-4 py-2 border-b border-[#2e2e2e] flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#5e5ce6] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-[#8a8a8a] text-xs truncate">{user?.name}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              location.pathname === item.path
                ? 'bg-[#242424] text-white'
                : 'text-[#8a8a8a] hover:bg-[#1e1e1e] hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-[#2e2e2e] space-y-0.5">
        <button
          onClick={handleSwitchWorkspace}
          className="w-full text-left px-3 py-1.5 rounded text-sm text-[#8a8a8a] hover:bg-[#1e1e1e] hover:text-white transition-colors"
        >
          Switch workspace
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-1.5 rounded text-sm text-[#8a8a8a] hover:bg-[#1e1e1e] hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Sidebar
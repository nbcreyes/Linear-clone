import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { label: 'Issues', path: '/issues' },
  ]

  return (
    <div className="w-60 h-screen bg-[#141414] border-r border-[#2e2e2e] flex flex-col">
      
      {/* Workspace header */}
      <div className="p-4 border-b border-[#2e2e2e]">
        <h2 className="text-white text-sm font-semibold truncate">
          Linear Clone
        </h2>
        <p className="text-[#8a8a8a] text-xs mt-0.5 truncate">
          {user?.email}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
              location.pathname === item.path
                ? 'bg-[#242424] text-white'
                : 'text-[#8a8a8a] hover:bg-[#1e1e1e] hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-[#2e2e2e]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#5e5ce6] flex items-center justify-center text-white text-xs font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-white text-sm truncate">{user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-[#8a8a8a] hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default Sidebar
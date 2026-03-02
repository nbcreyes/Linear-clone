import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import useAuthStore from '../store/authStore'
import useWorkspaceStore from '../store/workspaceStore'
import { useGetNotifications } from '../hooks/useNotifications'
import NotificationsPanel from './NotificationsPanel'
import socket from '../lib/socket'
import toast from 'react-hot-toast'

const navItems = [
  { label: 'My Issues', path: '/issues' },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace)
  const [showInvite, setShowInvite] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const { data: notifications } = useGetNotifications()
  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  // Listen for real-time notifications
  useEffect(() => {
    if (!user?._id) return

    socket.on(`notification:${user._id}`, (notification) => {
      queryClient.setQueryData(['notifications'], (old) => {
        if (!old) return [notification]
        return [notification, ...old]
      })
      toast(notification.message, {
        icon: '🔔',
        style: {
          background: '#1a1a1a',
          color: '#ffffff',
          border: '1px solid #2e2e2e',
          fontSize: '13px',
        },
      })
    })

    return () => {
      socket.off(`notification:${user._id}`)
    }
  }, [user?._id, queryClient])

  const handleLogout = () => {
    logout()
    clearWorkspace()
    navigate('/login')
  }

  const handleSwitchWorkspace = () => {
    clearWorkspace()
    navigate('/workspace')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentWorkspace?.inviteCode)
    toast.success('Invite code copied')
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/join/${currentWorkspace?.inviteCode}`
    navigator.clipboard.writeText(link)
    toast.success('Invite link copied')
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

        <p className="text-[#8a8a8a] text-xs mb-2">
          {currentWorkspace?.members?.length} member{currentWorkspace?.members?.length !== 1 ? 's' : ''}
        </p>

        <button
          onClick={() => setShowInvite(!showInvite)}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded bg-[#242424] hover:bg-[#2e2e2e] transition-colors"
        >
          <span className="text-xs text-[#8a8a8a]">Invite teammates</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={`transition-transform ${showInvite ? 'rotate-180' : ''}`}
          >
            <path
              d="M2 3.5l3 3 3-3"
              stroke="#8a8a8a"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {showInvite && (
          <div className="mt-2 space-y-2">
            <div>
              <p className="text-[10px] text-[#8a8a8a] mb-1">Invite code</p>
              <div className="flex items-center gap-1">
                <div className="flex-1 px-2 py-1.5 bg-[#0f0f0f] border border-[#2e2e2e] rounded text-xs text-white font-mono truncate">
                  {currentWorkspace?.inviteCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-2 py-1.5 bg-[#242424] hover:bg-[#2e2e2e] border border-[#2e2e2e] rounded transition-colors flex-shrink-0"
                  title="Copy invite code"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="4" y="4" width="7" height="7" rx="1" stroke="#8a8a8a" strokeWidth="1.2" />
                    <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="#8a8a8a" strokeWidth="1.2" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-[#8a8a8a] mb-1">Invite link</p>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between px-2 py-1.5 bg-[#0f0f0f] border border-[#2e2e2e] rounded hover:border-[#5e5ce6] transition-colors group"
              >
                <span className="text-xs text-[#8a8a8a] group-hover:text-white transition-colors truncate">
                  Copy invite link
                </span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0 ml-1">
                  <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" stroke="#8a8a8a" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M8 1h3m0 0v3m0-3L6 6" stroke="#8a8a8a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
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

        {/* Notifications button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-sm transition-colors ${
              showNotifications
                ? 'bg-[#242424] text-white'
                : 'text-[#8a8a8a] hover:bg-[#1e1e1e] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1a5 5 0 00-5 5v3l-1.5 2H14.5L13 9V6a5 5 0 00-5-5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M6.5 13a1.5 1.5 0 003 0"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-[#5e5ce6] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications panel */}
          {showNotifications && (
            <NotificationsPanel
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

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
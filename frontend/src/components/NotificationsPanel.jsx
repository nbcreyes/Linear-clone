import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useGetNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '../hooks/useNotifications'

function NotificationsPanel({ onClose }) {
  const navigate = useNavigate()
  const ref = useRef(null)
  const { data: notifications, isLoading } = useGetNotifications()
  const { mutate: markAsRead } = useMarkAsRead()
  const { mutate: markAllAsRead } = useMarkAllAsRead()

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id)
    }
    onClose()
    navigate(`/issues/${notification.issue._id}`)
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div
      ref={ref}
      className="absolute left-full bottom-0 ml-2 w-80 bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg shadow-2xl overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-2">
          <h3 className="text-white text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-[#5e5ce6] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs text-[#8a8a8a] hover:text-white transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-[#5e5ce6] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && (!notifications || notifications.length === 0) && (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <div className="w-8 h-8 rounded-full bg-[#242424] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1a5 5 0 00-5 5v3l-1.5 2H14.5L13 9V6a5 5 0 00-5-5z"
                  stroke="#8a8a8a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M6.5 13a1.5 1.5 0 003 0"
                  stroke="#8a8a8a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-[#8a8a8a] text-xs">No notifications yet</p>
          </div>
        )}

        {!isLoading && notifications?.map((notification) => (
          <button
            key={notification._id}
            onClick={() => handleNotificationClick(notification)}
            className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-[#242424] transition-colors border-b border-[#2e2e2e] last:border-0 text-left ${
              !notification.read ? 'bg-[#1e1e2e]' : ''
            }`}
          >
            {/* Actor avatar */}
            <div className="w-7 h-7 rounded-full bg-[#5e5ce6] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-medium">
                {notification.actor?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white leading-relaxed">
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-[#8a8a8a]">
                  {notification.workspace?.name}
                </span>
                <span className="text-[10px] text-[#4a4a4a]">·</span>
                <span className="text-[10px] text-[#8a8a8a]">
                  {formatTime(notification.createdAt)}
                </span>
              </div>
            </div>

            {/* Unread dot */}
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-[#5e5ce6] flex-shrink-0 mt-1.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPanel
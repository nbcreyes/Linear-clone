import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'

function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)

  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsUpdatingProfile(true)
    try {
      const { data } = await axiosInstance.put('/auth/profile', { name })
      login(data)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsUpdatingPassword(true)
    try {
      const { data } = await axiosInstance.put('/auth/profile', {
        currentPassword,
        newPassword,
      })
      login(data)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2e2e2e]">
        <button
          onClick={() => navigate('/issues')}
          className="flex items-center gap-1.5 text-[#8a8a8a] hover:text-white text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Issues
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-6 py-8">

          {/* Page title */}
          <h1 className="text-white text-xl font-semibold mb-8">
            Profile Settings
          </h1>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#5e5ce6] flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-[#8a8a8a] text-xs mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Update name */}
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-5 mb-4">
            <h2 className="text-white text-sm font-medium mb-4">
              Display name
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full bg-[#1a1a1a] border border-[#2e2e2e] text-[#8a8a8a] text-sm rounded px-3 py-2 outline-none cursor-not-allowed"
                />
                <p className="text-[10px] text-[#4a4a4a] mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingProfile || name === user?.name}
                  className="px-4 py-1.5 bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Update password */}
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-5">
            <h2 className="text-white text-sm font-medium mb-4">
              Change password
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">
                  Current password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8a8a8a] mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    isUpdatingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="px-4 py-1.5 bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
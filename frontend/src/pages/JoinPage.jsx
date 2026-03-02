import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useWorkspaceStore from '../store/workspaceStore'
import { useJoinWorkspace, useGetUserWorkspaces } from '../hooks/useWorkspace'

function JoinPage() {
  const { inviteCode } = useParams()
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace)
  const { mutate: joinWorkspace } = useJoinWorkspace()
  const { data: userWorkspaces } = useGetUserWorkspaces()
  const hasAttempted = useRef(false)

  useEffect(() => {
    // If not logged in save invite code and redirect to login
    if (!isAuthenticated) {
      localStorage.setItem('pendingInviteCode', inviteCode)
      navigate('/login')
      return
    }

    // Wait until we have the user workspaces loaded
    if (!userWorkspaces) return

    // Prevent running twice
    if (hasAttempted.current) return
    hasAttempted.current = true

    // Check if user is already a member of this workspace
    const existingWorkspace = userWorkspaces.find(
      (w) => w.inviteCode === inviteCode
    )

    if (existingWorkspace) {
      // Already a member, just switch to that workspace silently
      setWorkspace(existingWorkspace)
      navigate('/issues')
      return
    }

    // Not a member yet, join the workspace
    joinWorkspace(inviteCode, {
      onSuccess: () => navigate('/issues'),
      onError: () => navigate('/workspace'),
    })
  }, [inviteCode, isAuthenticated, userWorkspaces])

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#5e5ce6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8a8a8a] text-sm">Joining workspace...</p>
      </div>
    </div>
  )
}

export default JoinPage
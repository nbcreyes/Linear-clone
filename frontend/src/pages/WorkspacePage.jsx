import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateWorkspace, useJoinWorkspace, useGetUserWorkspaces } from '../hooks/useWorkspace'
import useWorkspaceStore from '../store/workspaceStore'
import useAuthStore from '../store/authStore'

function WorkspacePage() {
  const [tab, setTab] = useState('create')
  const [workspaceName, setWorkspaceName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace)
  const logout = useAuthStore((state) => state.logout)

  const { data: existingWorkspaces } = useGetUserWorkspaces()

  const { mutate: createWorkspace, isPending: isCreating } = useCreateWorkspace()
  const { mutate: joinWorkspace, isPending: isJoining } = useJoinWorkspace()

  const handleCreate = (e) => {
    e.preventDefault()
    setError('')
    if (!workspaceName.trim()) return

    createWorkspace(workspaceName, {
      onSuccess: () => navigate('/issues'),
      onError: (err) => setError(err.response?.data?.message || 'Something went wrong'),
    })
  }

  const handleJoin = (e) => {
    e.preventDefault()
    setError('')
    if (!inviteCode.trim()) return

    joinWorkspace(inviteCode, {
      onSuccess: () => navigate('/issues'),
      onError: (err) => setError(err.response?.data?.message || 'Something went wrong'),
    })
  }

  const handleSelectExisting = (workspace) => {
    setWorkspace(workspace)
    navigate('/issues')
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-white text-2xl font-semibold tracking-tight">
            Linear Clone
          </h1>
          <p className="text-[#8a8a8a] text-sm mt-1">
            Select or create a workspace to continue
          </p>
        </div>

        {/* Existing workspaces */}
        {existingWorkspaces && existingWorkspaces.length > 0 && (
          <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-4 mb-4">
            <h2 className="text-white text-sm font-medium mb-3">
              Your workspaces
            </h2>
            <div className="space-y-2">
              {existingWorkspaces.map((workspace) => (
                <button
                  key={workspace._id}
                  onClick={() => handleSelectExisting(workspace)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded bg-[#242424] hover:bg-[#2e2e2e] transition-colors"
                >
                  <div className="w-7 h-7 rounded bg-[#5e5ce6] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {workspace.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm">{workspace.name}</p>
                    <p className="text-[#8a8a8a] text-xs">
                      {workspace.members.length} member{workspace.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Create or Join */}
        <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg p-6">

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[#242424] p-1 rounded">
            <button
              onClick={() => { setTab('create'); setError('') }}
              className={`flex-1 py-1.5 text-sm rounded transition-colors ${
                tab === 'create'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-[#8a8a8a] hover:text-white'
              }`}
            >
              Create workspace
            </button>
            <button
              onClick={() => { setTab('join'); setError('') }}
              className={`flex-1 py-1.5 text-sm rounded transition-colors ${
                tab === 'join'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-[#8a8a8a] hover:text-white'
              }`}
            >
              Join workspace
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Create form */}
          {tab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a8a] mb-1">
                  Workspace name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Corp"
                  required
                  autoFocus
                  className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white text-sm font-medium py-2 rounded transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create workspace'}
              </button>
            </form>
          )}

          {/* Join form */}
          {tab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8a8a8a] mb-1">
                  Invite code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invite code"
                  required
                  autoFocus
                  className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isJoining}
                className="w-full bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white text-sm font-medium py-2 rounded transition-colors disabled:opacity-50"
              >
                {isJoining ? 'Joining...' : 'Join workspace'}
              </button>
            </form>
          )}
        </div>

        {/* Sign out */}
        <div className="text-center mt-4">
          <button
            onClick={handleLogout}
            className="text-sm text-[#8a8a8a] hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkspacePage
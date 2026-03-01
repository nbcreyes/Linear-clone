import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetIssues } from '../hooks/useIssues'
import IssueItem from '../components/IssueItem'
import CreateIssueModal from '../components/CreateIssueModal'
import socket from '../lib/socket'
import useWorkspaceStore from '../store/workspaceStore'

function IssuesPage() {
  const [showModal, setShowModal] = useState(false)
  const { data: issues, isLoading, isError } = useGetIssues()
  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  useEffect(() => {
  if (!workspaceId) return

  socket.on(`issue:created:${workspaceId}`, (newIssue) => {
    queryClient.setQueryData(['issues', workspaceId], (oldIssues) => {
      if (!oldIssues) return [newIssue]
      const exists = oldIssues.some((i) => i._id === newIssue._id)
      if (exists) return oldIssues
      return [newIssue, ...oldIssues]
    })
  })

  socket.on(`issue:updated:${workspaceId}`, (updatedIssue) => {
    queryClient.setQueryData(['issues', workspaceId], (oldIssues) => {
      if (!oldIssues) return oldIssues
      return oldIssues.map((i) =>
        i._id === updatedIssue._id ? updatedIssue : i
      )
    })
  })

  socket.on(`issue:deleted:${workspaceId}`, (deletedId) => {
    queryClient.setQueryData(['issues', workspaceId], (oldIssues) => {
      if (!oldIssues) return oldIssues
      return oldIssues.filter((i) => i._id !== deletedId)
    })
  })

  return () => {
    socket.off(`issue:created:${workspaceId}`)
    socket.off(`issue:updated:${workspaceId}`)
    socket.off(`issue:deleted:${workspaceId}`)
  }
}, [queryClient, workspaceId])

  const todoIssues = issues?.filter((i) => i.status === 'todo') || []
  const inProgressIssues = issues?.filter((i) => i.status === 'in-progress') || []
  const backlogIssues = issues?.filter((i) => i.status === 'backlog') || []
  const doneIssues = issues?.filter((i) => i.status === 'done') || []
  const cancelledIssues = issues?.filter((i) => i.status === 'cancelled') || []

  const groups = [
    { label: 'In Progress', issues: inProgressIssues },
    { label: 'Todo', issues: todoIssues },
    { label: 'Backlog', issues: backlogIssues },
    { label: 'Done', issues: doneIssues },
    { label: 'Cancelled', issues: cancelledIssues },
  ]

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-3">
          <h1 className="text-white text-sm font-semibold">Issues</h1>
          {issues && (
            <span className="text-xs text-[#8a8a8a] bg-[#242424] px-2 py-0.5 rounded-full">
              {issues.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1.5 bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white text-xs font-medium rounded transition-colors"
        >
          New Issue
        </button>
      </div>

      {/* Issues list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <p className="text-[#8a8a8a] text-sm">Loading issues...</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-32">
            <p className="text-red-400 text-sm">Failed to load issues</p>
          </div>
        )}

        {!isLoading && !isError && issues?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            <p className="text-[#8a8a8a] text-sm">No issues yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-[#5e5ce6] text-xs hover:underline"
            >
              Create your first issue
            </button>
          </div>
        )}

        {!isLoading && !isError && issues?.length > 0 && (
          <div>
            {groups.map((group) =>
              group.issues.length > 0 ? (
                <div key={group.label}>
                  {/* Group header */}
                  <div className="flex items-center gap-2 px-4 py-2 sticky top-0 bg-[#0f0f0f] border-b border-[#2e2e2e]">
                    <span className="text-xs text-[#8a8a8a] font-medium">
                      {group.label}
                    </span>
                    <span className="text-xs text-[#8a8a8a] bg-[#242424] px-1.5 py-0.5 rounded-full">
                      {group.issues.length}
                    </span>
                  </div>
                  {group.issues.map((issue) => (
                    <IssueItem key={issue._id} issue={issue} />
                  ))}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      {showModal && (
        <CreateIssueModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default IssuesPage
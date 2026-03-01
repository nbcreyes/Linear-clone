import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetIssues } from '../hooks/useIssues'
import IssueItem from '../components/IssueItem'
import CreateIssueModal from '../components/CreateIssueModal'
import socket from '../lib/socket'

function IssuesPage() {
  const [showModal, setShowModal] = useState(false)
  const { data: issues, isLoading, isError } = useGetIssues()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Listen for new issue
    socket.on('issue:created', (newIssue) => {
      queryClient.setQueryData(['issues'], (oldIssues) => {
        if (!oldIssues) return [newIssue]
        // Avoid duplicates
        const exists = oldIssues.some((i) => i._id === newIssue._id)
        if (exists) return oldIssues
        return [newIssue, ...oldIssues]
      })
    })

    // Listen for updated issue
    socket.on('issue:updated', (updatedIssue) => {
      queryClient.setQueryData(['issues'], (oldIssues) => {
        if (!oldIssues) return oldIssues
        return oldIssues.map((i) =>
          i._id === updatedIssue._id ? updatedIssue : i
        )
      })
    })

    // Listen for deleted issue
    socket.on('issue:deleted', (deletedId) => {
      queryClient.setQueryData(['issues'], (oldIssues) => {
        if (!oldIssues) return oldIssues
        return oldIssues.filter((i) => i._id !== deletedId)
      })
    })

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('issue:created')
      socket.off('issue:updated')
      socket.off('issue:deleted')
    }
  }, [queryClient])

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]">
        <h1 className="text-white text-sm font-semibold">Issues</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1.5 bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white text-sm rounded transition-colors"
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
          <div className="flex items-center justify-center h-32">
            <p className="text-[#8a8a8a] text-sm">
              No issues yet. Create your first one.
            </p>
          </div>
        )}

        {!isLoading && !isError && issues?.map((issue) => (
          <IssueItem key={issue._id} issue={issue} />
        ))}
      </div>

      {/* Create Issue Modal */}
      {showModal && (
        <CreateIssueModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

export default IssuesPage
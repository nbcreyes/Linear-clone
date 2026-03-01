import { useState, useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetIssues } from '../hooks/useIssues'
import IssueItem from '../components/IssueItem'
import CreateIssueModal from '../components/CreateIssueModal'
import socket from '../lib/socket'
import useWorkspaceStore from '../store/workspaceStore'

const statusOptions = ['backlog', 'todo', 'in-progress', 'done', 'cancelled']
const priorityOptions = ['no-priority', 'urgent', 'high', 'medium', 'low']

const statusStyles = {
  backlog: 'Backlog',
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled',
}

const priorityStyles = {
  'no-priority': 'No Priority',
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

function IssuesPage() {
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

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

  // Filter and search logic
  const filteredIssues = useMemo(() => {
    if (!issues) return []

    return issues.filter((issue) => {
      const matchesSearch = issue.title
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesStatus = filterStatus
        ? issue.status === filterStatus
        : true

      const matchesPriority = filterPriority
        ? issue.priority === filterPriority
        : true

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [issues, search, filterStatus, filterPriority])

  const hasActiveFilters = search || filterStatus || filterPriority

  const clearFilters = () => {
    setSearch('')
    setFilterStatus('')
    setFilterPriority('')
  }

  const groups = [
    { label: 'In Progress', key: 'in-progress' },
    { label: 'Todo', key: 'todo' },
    { label: 'Backlog', key: 'backlog' },
    { label: 'Done', key: 'done' },
    { label: 'Cancelled', key: 'cancelled' },
  ].map((group) => ({
    ...group,
    issues: filteredIssues.filter((i) => i.status === group.key),
  }))

  return (
    <div className="h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#2e2e2e]">
        <div className="flex items-center gap-3">
          <h1 className="text-white text-sm font-semibold">Issues</h1>
          {issues && (
            <span className="text-xs text-[#8a8a8a] bg-[#242424] px-2 py-0.5 rounded-full">
              {filteredIssues.length}
              {hasActiveFilters && issues.length !== filteredIssues.length && (
                <span className="text-[#8a8a8a]"> of {issues.length}</span>
              )}
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

      {/* Search and filters */}
      <div className="flex items-center gap-2 px-6 py-2 border-b border-[#2e2e2e]">

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search issues..."
          className="flex-1 bg-[#1a1a1a] border border-[#2e2e2e] text-white text-xs rounded px-3 py-1.5 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
        />

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`bg-[#1a1a1a] border border-[#2e2e2e] text-xs rounded px-3 py-1.5 outline-none focus:border-[#5e5ce6] transition-colors cursor-pointer ${
            filterStatus ? 'text-white border-[#5e5ce6]' : 'text-[#8a8a8a]'
          }`}
        >
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a1a] text-white">
              {statusStyles[s]}
            </option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className={`bg-[#1a1a1a] border border-[#2e2e2e] text-xs rounded px-3 py-1.5 outline-none focus:border-[#5e5ce6] transition-colors cursor-pointer ${
            filterPriority ? 'text-white border-[#5e5ce6]' : 'text-[#8a8a8a]'
          }`}
        >
          <option value="">All priorities</option>
          {priorityOptions.map((p) => (
            <option key={p} value={p} className="bg-[#1a1a1a] text-white">
              {priorityStyles[p]}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#8a8a8a] hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-[#242424]"
          >
            Clear
          </button>
        )}
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

        {!isLoading && !isError && filteredIssues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2">
            {hasActiveFilters ? (
              <>
                <p className="text-[#8a8a8a] text-sm">
                  No issues match your filters
                </p>
                <button
                  onClick={clearFilters}
                  className="text-[#5e5ce6] text-xs hover:underline"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="text-[#8a8a8a] text-sm">No issues yet</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-[#5e5ce6] text-xs hover:underline"
                >
                  Create your first issue
                </button>
              </>
            )}
          </div>
        )}

        {!isLoading && !isError && filteredIssues.length > 0 && (
          <div>
            {groups.map((group) =>
              group.issues.length > 0 ? (
                <div key={group.key}>
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
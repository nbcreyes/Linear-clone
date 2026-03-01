import { useDeleteIssue, useUpdateIssue } from '../hooks/useIssues'

const statusOptions = ['backlog', 'todo', 'in-progress', 'done', 'cancelled']
const priorityOptions = ['no-priority', 'urgent', 'high', 'medium', 'low']

const statusColors = {
  backlog: 'text-[#8a8a8a]',
  todo: 'text-[#5e5ce6]',
  'in-progress': 'text-[#f5a623]',
  done: 'text-[#4caf50]',
  cancelled: 'text-[#f44336]',
}

const priorityColors = {
  'no-priority': 'text-[#8a8a8a]',
  urgent: 'text-[#f44336]',
  high: 'text-[#f5a623]',
  medium: 'text-[#5e5ce6]',
  low: 'text-[#4caf50]',
}

function IssueItem({ issue }) {
  const { mutate: deleteIssue } = useDeleteIssue()
  const { mutate: updateIssue } = useUpdateIssue()

  const handleStatusChange = (e) => {
    updateIssue({ id: issue._id, status: e.target.value })
  }

  const handlePriorityChange = (e) => {
    updateIssue({ id: issue._id, priority: e.target.value })
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2e2e2e] hover:bg-[#1a1a1a] group transition-colors">

      {/* Priority */}
      <select
        value={issue.priority}
        onChange={handlePriorityChange}
        className={`bg-transparent border-none outline-none text-xs cursor-pointer ${priorityColors[issue.priority]}`}
      >
        {priorityOptions.map((p) => (
          <option key={p} value={p} className="bg-[#1a1a1a] text-white">
            {p}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={issue.status}
        onChange={handleStatusChange}
        className={`bg-transparent border-none outline-none text-xs cursor-pointer ${statusColors[issue.status]}`}
      >
        {statusOptions.map((s) => (
          <option key={s} value={s} className="bg-[#1a1a1a] text-white">
            {s}
          </option>
        ))}
      </select>

      {/* Title */}
      <span className="flex-1 text-sm text-white truncate">
        {issue.title}
      </span>

      {/* Assignee */}
      <span className="text-xs text-[#8a8a8a] hidden group-hover:inline">
        {issue.assignee?.name || 'Unassigned'}
      </span>

      {/* Created by */}
      <span className="text-xs text-[#8a8a8a]">
        {issue.createdBy?.name}
      </span>

      {/* Delete button */}
      <button
        onClick={() => deleteIssue(issue._id)}
        className="text-[#8a8a8a] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs"
      >
        Delete
      </button>
    </div>
  )
}

export default IssueItem
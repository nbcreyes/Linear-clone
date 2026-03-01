import { useDeleteIssue, useUpdateIssue } from '../hooks/useIssues'

const statusOptions = ['backlog', 'todo', 'in-progress', 'done', 'cancelled']
const priorityOptions = ['no-priority', 'urgent', 'high', 'medium', 'low']

const statusStyles = {
  backlog: { color: 'text-[#8a8a8a]', bg: 'bg-[#8a8a8a]', label: 'Backlog' },
  todo: { color: 'text-[#5e5ce6]', bg: 'bg-[#5e5ce6]', label: 'Todo' },
  'in-progress': { color: 'text-[#f5a623]', bg: 'bg-[#f5a623]', label: 'In Progress' },
  done: { color: 'text-[#4caf50]', bg: 'bg-[#4caf50]', label: 'Done' },
  cancelled: { color: 'text-[#f44336]', bg: 'bg-[#f44336]', label: 'Cancelled' },
}

const priorityStyles = {
  'no-priority': { color: 'text-[#8a8a8a]', label: 'No Priority' },
  urgent: { color: 'text-[#f44336]', label: 'Urgent' },
  high: { color: 'text-[#f5a623]', label: 'High' },
  medium: { color: 'text-[#5e5ce6]', label: 'Medium' },
  low: { color: 'text-[#4caf50]', label: 'Low' },
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

  const status = statusStyles[issue.status] || statusStyles.todo
  const priority = priorityStyles[issue.priority] || priorityStyles['no-priority']

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#2e2e2e] hover:bg-[#1a1a1a] group transition-colors">

      {/* Priority selector */}
      <select
        value={issue.priority}
        onChange={handlePriorityChange}
        className={`bg-transparent border-none outline-none text-xs cursor-pointer font-medium ${priority.color}`}
        title="Priority"
      >
        {priorityOptions.map((p) => (
          <option key={p} value={p} className="bg-[#1a1a1a] text-white">
            {priorityStyles[p].label}
          </option>
        ))}
      </select>

      {/* Status indicator dot + selector */}
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${status.bg} flex-shrink-0`} />
        <select
          value={issue.status}
          onChange={handleStatusChange}
          className={`bg-transparent border-none outline-none text-xs cursor-pointer font-medium ${status.color}`}
          title="Status"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s} className="bg-[#1a1a1a] text-white">
              {statusStyles[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <span className="flex-1 text-sm text-white truncate">
        {issue.title}
      </span>

      {/* Description preview */}
      {issue.description && (
        <span className="text-xs text-[#8a8a8a] truncate max-w-xs hidden group-hover:inline">
          {issue.description}
        </span>
      )}

      {/* Assignee */}
      <span className="text-xs text-[#8a8a8a] hidden group-hover:inline flex-shrink-0">
        {issue.assignee?.name || 'Unassigned'}
      </span>

      {/* Created by avatar */}
      <div
        className="w-5 h-5 rounded-full bg-[#5e5ce6] flex items-center justify-center text-white flex-shrink-0"
        title={issue.createdBy?.name}
      >
        <span className="text-[10px] font-medium">
          {issue.createdBy?.name?.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Delete button */}
      <button
        onClick={() => deleteIssue(issue._id)}
        className="text-[#8a8a8a] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs flex-shrink-0"
      >
        Delete
      </button>
    </div>
  )
}

export default IssueItem
import { Link } from 'react-router-dom'
import { useDeleteIssue, useUpdateIssue } from '../hooks/useIssues'
import StatusIcon from './StatusIcon'
import PriorityIcon from './PriorityIcon'

const statusOptions = ['backlog', 'todo', 'in-progress', 'done', 'cancelled']
const priorityOptions = ['no-priority', 'urgent', 'high', 'medium', 'low']

const statusStyles = {
  backlog: { color: 'text-[#8a8a8a]', label: 'Backlog' },
  todo: { color: 'text-[#5e5ce6]', label: 'Todo' },
  'in-progress': { color: 'text-[#f5a623]', label: 'In Progress' },
  done: { color: 'text-[#4caf50]', label: 'Done' },
  cancelled: { color: 'text-[#8a8a8a]', label: 'Cancelled' },
}

const priorityStyles = {
  'no-priority': { label: 'No Priority' },
  urgent: { label: 'Urgent' },
  high: { label: 'High' },
  medium: { label: 'Medium' },
  low: { label: 'Low' },
}

function IssueItem({ issue }) {
  const { mutate: deleteIssue } = useDeleteIssue()
  const { mutate: updateIssue } = useUpdateIssue()

  const handleStatusChange = (e) => {
    e.stopPropagation()
    updateIssue({ id: issue._id, status: e.target.value })
  }

  const handlePriorityChange = (e) => {
    e.stopPropagation()
    updateIssue({ id: issue._id, priority: e.target.value })
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2e2e2e] hover:bg-[#1a1a1a] group transition-colors">

      {/* Priority */}
      <div className="relative flex-shrink-0">
        <div className="flex items-center justify-center w-5 h-5 cursor-pointer">
          <PriorityIcon priority={issue.priority} />
        </div>
        <select
          value={issue.priority}
          onChange={handlePriorityChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
          title="Change priority"
        >
          {priorityOptions.map((p) => (
            <option key={p} value={p}>
              {priorityStyles[p].label}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="relative flex-shrink-0">
        <div className="flex items-center justify-center w-5 h-5 cursor-pointer">
          <StatusIcon status={issue.status} />
        </div>
        <select
          value={issue.status}
          onChange={handleStatusChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
          title="Change status"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {statusStyles[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <Link
        to={`/issues/${issue._id}`}
        className="flex-1 text-sm text-white truncate hover:text-[#5e5ce6] transition-colors"
      >
        {issue.title}
      </Link>

      {/* Assignee */}
      {issue.assignee ? (
        <div
          className="w-5 h-5 rounded-full bg-[#5e5ce6] flex items-center justify-center flex-shrink-0"
          title={issue.assignee.name}
        >
          <span className="text-white text-[10px] font-medium">
            {issue.assignee.name.charAt(0).toUpperCase()}
          </span>
        </div>
      ) : (
        <div
          className="w-5 h-5 rounded-full border border-dashed border-[#4a4a4a] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Unassigned"
        />
      )}

      {/* Created by */}
      <div
        className="w-5 h-5 rounded-full bg-[#2e2e2e] flex items-center justify-center flex-shrink-0"
        title={`Created by ${issue.createdBy?.name}`}
      >
        <span className="text-[#8a8a8a] text-[10px] font-medium">
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
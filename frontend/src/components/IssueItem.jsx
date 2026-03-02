import { Link } from 'react-router-dom'
import { useDeleteIssue, useUpdateIssue } from '../hooks/useIssues'
import StatusIcon from './StatusIcon'
import PriorityIcon from './PriorityIcon'
import Dropdown from './Dropdown'

const statusOptions = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
]

const priorityOptions = [
  { value: 'no-priority', label: 'No Priority' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const dueDateColor = (dueDate) => {
  if (!dueDate) return ''
  const now = new Date()
  const due = new Date(dueDate)
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'text-red-400'
  if (diffDays <= 2) return 'text-[#f5a623]'
  return 'text-[#8a8a8a]'
}

const formatDueDate = (dueDate) => {
  if (!dueDate) return null
  const due = new Date(dueDate)
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function IssueItem({ issue }) {
  const { mutate: deleteIssue } = useDeleteIssue()
  const { mutate: updateIssue } = useUpdateIssue()

  const statusOptionsWithIcons = statusOptions.map((s) => ({
    ...s,
    icon: <StatusIcon status={s.value} size={12} />,
  }))

  const priorityOptionsWithIcons = priorityOptions.map((p) => ({
    ...p,
    icon: <PriorityIcon priority={p.value} size={12} />,
  }))

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#2e2e2e] hover:bg-[#1a1a1a] group transition-colors">

      {/* Priority */}
      <Dropdown
        value={issue.priority}
        options={priorityOptionsWithIcons}
        onChange={(value) => updateIssue({ id: issue._id, priority: value })}
        trigger={
          <div className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#2e2e2e] transition-colors">
            <PriorityIcon priority={issue.priority} size={12} />
          </div>
        }
      />

      {/* Status */}
      <Dropdown
        value={issue.status}
        options={statusOptionsWithIcons}
        onChange={(value) => updateIssue({ id: issue._id, status: value })}
        trigger={
          <div className="flex items-center justify-center w-5 h-5 rounded hover:bg-[#2e2e2e] transition-colors">
            <StatusIcon status={issue.status} size={14} />
          </div>
        }
      />

      {/* Identifier */}
      <span className="text-xs text-[#4a4a4a] font-mono flex-shrink-0 w-16">
        {issue.identifier}
      </span>

      {/* Title */}
      <Link
        to={`/issues/${issue._id}`}
        className="flex-1 text-sm text-white truncate hover:text-[#5e5ce6] transition-colors"
      >
        {issue.title}
      </Link>

      {/* Due date */}
      {issue.dueDate && (
        <span className={`text-xs flex-shrink-0 ${dueDateColor(issue.dueDate)}`}>
          {formatDueDate(issue.dueDate)}
        </span>
      )}

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
import { useState } from 'react'
import { useCreateIssue } from '../hooks/useIssues'
import { useGetWorkspaceMembers } from '../hooks/useWorkspace'
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

function CreateIssueModal({ onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('todo')
  const [priority, setPriority] = useState('no-priority')
  const [assignee, setAssignee] = useState('')

  const { mutate: createIssue, isPending } = useCreateIssue()
  const { data: members } = useGetWorkspaceMembers()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    createIssue(
      {
        title,
        description,
        status,
        priority,
        assignee: assignee || null,
      },
      { onSuccess: onClose }
    )
  }

  const selectedStatus = statusOptions.find((s) => s.value === status)
  const selectedPriority = priorityOptions.find((p) => p.value === priority)
  const selectedMember = members?.find((m) => m.user._id === assignee)

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="px-4 pt-4 pb-2 border-b border-[#2e2e2e]">
          <h2 className="text-white text-sm font-semibold">Create Issue</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 py-3 space-y-3">

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              required
              autoFocus
              className="w-full bg-transparent text-white text-sm outline-none placeholder-[#4a4a4a]"
            />

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full bg-transparent text-white text-sm outline-none placeholder-[#4a4a4a] resize-none"
            />
          </div>

          {/* Properties row */}
          <div className="px-4 py-2 border-t border-[#2e2e2e] flex items-center gap-2 flex-wrap">

            {/* Status */}
            <Dropdown
              value={status}
              options={statusOptions.map((s) => ({
                ...s,
                icon: <StatusIcon status={s.value} size={12} />,
              }))}
              onChange={setStatus}
              trigger={
                <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#2e2e2e] hover:border-[#3e3e3e] hover:bg-[#242424] transition-colors">
                  <StatusIcon status={status} size={12} />
                  <span className="text-xs text-[#c0c0c0]">
                    {selectedStatus?.label}
                  </span>
                </div>
              }
            />

            {/* Priority */}
            <Dropdown
              value={priority}
              options={priorityOptions.map((p) => ({
                ...p,
                icon: <PriorityIcon priority={p.value} size={12} />,
              }))}
              onChange={setPriority}
              trigger={
                <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#2e2e2e] hover:border-[#3e3e3e] hover:bg-[#242424] transition-colors">
                  <PriorityIcon priority={priority} size={12} />
                  <span className="text-xs text-[#c0c0c0]">
                    {selectedPriority?.label}
                  </span>
                </div>
              }
            />

            {/* Assignee */}
            <Dropdown
              value={assignee}
              options={[
                { value: '', label: 'Unassigned' },
                ...(members?.map((m) => ({
                  value: m.user._id,
                  label: m.user.name,
                })) || []),
              ]}
              onChange={setAssignee}
              trigger={
                <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#2e2e2e] hover:border-[#3e3e3e] hover:bg-[#242424] transition-colors">
                  {selectedMember ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#5e5ce6] flex items-center justify-center">
                        <span className="text-white text-[8px] font-medium">
                          {selectedMember.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-[#c0c0c0]">
                        {selectedMember.user.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-[#8a8a8a]">Assignee</span>
                  )}
                </div>
              }
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[#2e2e2e] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#8a8a8a] hover:text-white rounded hover:bg-[#242424] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="px-3 py-1.5 text-xs bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating...' : 'Create issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateIssueModal
import { useState } from 'react'
import { useCreateIssue } from '../hooks/useIssues'
import { useGetWorkspaceMembers } from '../hooks/useWorkspace'

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg w-full max-w-md p-6">

        <h2 className="text-white text-lg font-semibold mb-4">
          Create Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              required
              autoFocus
              className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6] placeholder-[#4a4a4a] transition-colors resize-none"
            />
          </div>

          {/* Status and Priority */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-[#8a8a8a] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6]"
              >
                {['backlog', 'todo', 'in-progress', 'done', 'cancelled'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs text-[#8a8a8a] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6]"
              >
                {['no-priority', 'urgent', 'high', 'medium', 'low'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-xs text-[#8a8a8a] mb-1">
              Assignee
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full bg-[#242424] border border-[#2e2e2e] text-white text-sm rounded px-3 py-2 outline-none focus:border-[#5e5ce6]"
            >
              <option value="">Unassigned</option>
              {members?.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#8a8a8a] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white rounded transition-colors disabled:opacity-50"
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
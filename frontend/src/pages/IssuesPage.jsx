import { useState } from 'react'
import { useGetIssues } from '../hooks/useIssues'
import IssueItem from '../components/IssueItem'
import CreateIssueModal from '../components/CreateIssueModal'

function IssuesPage() {
  const [showModal, setShowModal] = useState(false)
  const { data: issues, isLoading, isError } = useGetIssues()

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
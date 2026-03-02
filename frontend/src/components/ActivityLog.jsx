import { useGetActivity } from '../hooks/useActivity'

const activityLabels = {
  created: { label: 'created this issue', color: 'text-[#8a8a8a]' },
  status_changed: { label: 'changed status', color: 'text-[#f5a623]' },
  priority_changed: { label: 'changed priority', color: 'text-[#8a8a8a]' },
  assignee_changed: { label: 'changed assignee', color: 'text-[#8a8a8a]' },
  title_changed: { label: 'changed title', color: 'text-[#8a8a8a]' },
  description_changed: { label: 'updated description', color: 'text-[#8a8a8a]' },
  due_date_changed: { label: 'changed due date', color: 'text-[#8a8a8a]' },
}

const statusColors = {
  backlog: 'text-[#8a8a8a]',
  todo: 'text-[#5e5ce6]',
  'in-progress': 'text-[#f5a623]',
  done: 'text-[#4caf50]',
  cancelled: 'text-[#f44336]',
}

const statusLabels = {
  backlog: 'Backlog',
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
  cancelled: 'Cancelled',
}

const priorityLabels = {
  'no-priority': 'No Priority',
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

function ActivityItem({ activity }) {
  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const renderDetail = () => {
    switch (activity.type) {
      case 'status_changed':
        return (
          <span className="text-[10px] text-[#8a8a8a]">
            <span className={`${statusColors[activity.from]} font-medium`}>
              {statusLabels[activity.from] || activity.from}
            </span>
            <span className="mx-1">→</span>
            <span className={`${statusColors[activity.to]} font-medium`}>
              {statusLabels[activity.to] || activity.to}
            </span>
          </span>
        )
      case 'priority_changed':
        return (
          <span className="text-[10px] text-[#8a8a8a]">
            <span className="text-white font-medium">
              {priorityLabels[activity.from] || activity.from}
            </span>
            <span className="mx-1">→</span>
            <span className="text-white font-medium">
              {priorityLabels[activity.to] || activity.to}
            </span>
          </span>
        )
      case 'title_changed':
        return (
          <span className="text-[10px] text-[#8a8a8a]">
            <span className="line-through">{activity.from}</span>
            <span className="mx-1">→</span>
            <span className="text-white">{activity.to}</span>
          </span>
        )
      case 'due_date_changed':
        return (
          <span className="text-[10px] text-[#8a8a8a]">
            {activity.from ? (
              <>
                <span className="text-white">{activity.from}</span>
                <span className="mx-1">→</span>
              </>
            ) : null}
            {activity.to ? (
              <span className="text-white">{activity.to}</span>
            ) : (
              <span className="text-[#f44336]">removed</span>
            )}
          </span>
        )
      default:
        return null
    }
  }

  const label = activityLabels[activity.type]

  return (
    <div className="flex items-start gap-3">

      {/* Actor avatar */}
      <div className="w-6 h-6 rounded-full bg-[#2e2e2e] flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[#8a8a8a] text-[9px] font-medium">
          {activity.actor?.name?.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-white">
            {activity.actor?.name}
          </span>
          <span className={`text-xs ${label?.color}`}>
            {label?.label}
          </span>
          <span className="text-[10px] text-[#4a4a4a]">
            {formatTime(activity.createdAt)}
          </span>
        </div>
        {renderDetail() && (
          <div className="mt-1">
            {renderDetail()}
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityLog({ issueId }) {
  const { data: activities, isLoading } = useGetActivity(issueId)

  return (
    <div className="mt-8">

      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-medium text-[#8a8a8a] uppercase tracking-wider">
          Activity
        </h3>
        {activities?.length > 0 && (
          <span className="text-xs text-[#8a8a8a] bg-[#242424] px-1.5 py-0.5 rounded-full">
            {activities.length}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#242424] animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-48 h-2.5 bg-[#242424] rounded animate-pulse" />
                  <div className="w-32 h-2 bg-[#242424] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && activities?.length === 0 && (
          <p className="text-xs text-[#4a4a4a] py-2">
            No activity yet.
          </p>
        )}

        {!isLoading && activities?.map((activity) => (
          <ActivityItem key={activity._id} activity={activity} />
        ))}
      </div>
    </div>
  )
}

export default ActivityLog
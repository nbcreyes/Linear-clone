function StatusIcon({ status, size = 14 }) {
  const icons = {
    backlog: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="#8a8a8a"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      </svg>
    ),
    todo: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="#5e5ce6"
          strokeWidth="1.5"
        />
      </svg>
    ),
    'in-progress': (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="#f5a623"
          strokeWidth="1.5"
        />
        <path
          d="M7 1a6 6 0 0 1 6 6"
          stroke="#f5a623"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    done: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <circle
          cx="7"
          cy="7"
          r="6"
          fill="#4caf50"
        />
        <path
          d="M4 7l2 2 4-4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    cancelled: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <circle
          cx="7"
          cy="7"
          r="6"
          fill="#4a4a4a"
        />
        <path
          d="M5 5l4 4M9 5l-4 4"
          stroke="#8a8a8a"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  }

  return icons[status] || icons.todo
}

export default StatusIcon
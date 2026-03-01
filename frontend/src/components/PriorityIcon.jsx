function PriorityIcon({ priority, size = 14 }) {
  const icons = {
    'no-priority': (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <rect x="1" y="6" width="2" height="2" rx="0.5" fill="#4a4a4a" />
        <rect x="6" y="6" width="2" height="2" rx="0.5" fill="#4a4a4a" />
        <rect x="11" y="6" width="2" height="2" rx="0.5" fill="#4a4a4a" />
      </svg>
    ),
    urgent: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <rect x="1" y="7" width="2" height="5" rx="0.5" fill="#f44336" />
        <rect x="4.5" y="4" width="2" height="8" rx="0.5" fill="#f44336" />
        <rect x="8" y="1" width="2" height="11" rx="0.5" fill="#f44336" />
        <rect x="11.5" y="1" width="2" height="11" rx="0.5" fill="#f44336" />
      </svg>
    ),
    high: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <rect x="1" y="7" width="2" height="5" rx="0.5" fill="#f5a623" />
        <rect x="4.5" y="4" width="2" height="8" rx="0.5" fill="#f5a623" />
        <rect x="8" y="1" width="2" height="11" rx="0.5" fill="#f5a623" />
        <rect x="11.5" y="4" width="2" height="8" rx="0.5" fill="#2e2e2e" />
      </svg>
    ),
    medium: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <rect x="1" y="7" width="2" height="5" rx="0.5" fill="#5e5ce6" />
        <rect x="4.5" y="4" width="2" height="8" rx="0.5" fill="#5e5ce6" />
        <rect x="8" y="1" width="2" height="11" rx="0.5" fill="#2e2e2e" />
        <rect x="11.5" y="4" width="2" height="8" rx="0.5" fill="#2e2e2e" />
      </svg>
    ),
    low: (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <rect x="1" y="7" width="2" height="5" rx="0.5" fill="#4caf50" />
        <rect x="4.5" y="4" width="2" height="8" rx="0.5" fill="#2e2e2e" />
        <rect x="8" y="1" width="2" height="11" rx="0.5" fill="#2e2e2e" />
        <rect x="11.5" y="4" width="2" height="8" rx="0.5" fill="#2e2e2e" />
      </svg>
    ),
  }

  return icons[priority] || icons['no-priority']
}

export default PriorityIcon
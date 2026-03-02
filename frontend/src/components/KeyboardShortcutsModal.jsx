import { useEffect, useRef } from 'react'

const shortcuts = [
  {
    category: 'General',
    items: [
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal or cancel action' },
    ],
  },
  {
    category: 'Issues',
    items: [
      { keys: ['C'], description: 'Create new issue' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['G', 'I'], description: 'Go to Issues' },
      { keys: ['G', 'P'], description: 'Go to Profile' },
      { keys: ['G', 'W'], description: 'Go to Workspaces' },
    ],
  },
  {
    category: 'Issue Detail',
    items: [
      { keys: ['E'], description: 'Edit issue title' },
      { keys: ['Ctrl', 'Enter'], description: 'Submit comment' },
      { keys: ['Esc'], description: 'Cancel editing' },
    ],
  },
]

function KeyboardShortcutsModal({ onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        ref={ref}
        className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2e2e2e]">
          <h2 className="text-white text-sm font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-[#8a8a8a] hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="px-5 py-4 space-y-5 max-h-96 overflow-y-auto">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <p className="text-[10px] text-[#4a4a4a] font-medium uppercase tracking-wider mb-2">
                {group.category}
              </p>
              <div className="space-y-1">
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-xs text-[#8a8a8a]">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key, j) => (
                        <span key={j} className="flex items-center gap-1">
                          <kbd className="px-2 py-0.5 bg-[#242424] border border-[#3e3e3e] rounded text-[11px] text-white font-mono">
                            {key}
                          </kbd>
                          {j < item.keys.length - 1 && (
                            <span className="text-[10px] text-[#4a4a4a]">
                              then
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#2e2e2e]">
          <p className="text-[10px] text-[#4a4a4a] text-center">
            Press <kbd className="px-1.5 py-0.5 bg-[#242424] border border-[#3e3e3e] rounded text-[10px] text-white font-mono">?</kbd> to toggle this panel
          </p>
        </div>
      </div>
    </div>
  )
}

export default KeyboardShortcutsModal
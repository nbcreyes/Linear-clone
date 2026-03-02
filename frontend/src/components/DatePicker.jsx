import { useState, useRef, useEffect } from 'react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function DatePicker({ value, onChange, alignRight = false }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    return value ? new Date(value) : new Date()
  })
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedDate = value ? new Date(value) : null

  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
  const startDay = startOfMonth.getDay()
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleSelectDay = (day) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    onChange(selected.toISOString().split('T')[0])
    setOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange(null)
    setOpen(false)
  }

  const isSelected = (day) => {
    if (!selectedDate) return false
    return (
      selectedDate.getFullYear() === viewDate.getFullYear() &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getDate() === day
    )
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      today.getFullYear() === viewDate.getFullYear() &&
      today.getMonth() === viewDate.getMonth() &&
      today.getDate() === day
    )
  }

  const isOverdue = (day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    return date < today
  }

  const formatDisplay = () => {
    if (!selectedDate) return null
    return selectedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const displayColor = () => {
    if (!selectedDate) return 'text-[#8a8a8a]'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return 'text-red-400'
    if (diffDays <= 2) return 'text-[#f5a623]'
    return 'text-[#c0c0c0]'
  }

  // Build calendar grid
  const cells = []
  for (let i = 0; i < startDay; i++) {
    cells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d)
  }

  return (
    <div className="relative" ref={ref}>

      {/* Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setOpen(!open)
        }}
        className="flex items-center gap-1.5 px-2 py-1 rounded border border-[#2e2e2e] hover:border-[#3e3e3e] hover:bg-[#242424] transition-colors cursor-pointer"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="2" width="10" height="9" rx="1" stroke="#8a8a8a" strokeWidth="1.2" />
          <path d="M1 5h10" stroke="#8a8a8a" strokeWidth="1.2" />
          <path d="M4 1v2M8 1v2" stroke="#8a8a8a" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className={`text-xs ${displayColor()}`}>
          {formatDisplay() || 'Due date'}
        </span>
        {selectedDate && (
          <button
            onClick={handleClear}
            className="ml-1 text-[#4a4a4a] hover:text-[#8a8a8a] transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 2l6 6M8 2l-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Calendar */}
      {open && (
        <div className={`absolute z-50 mt-1 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg shadow-xl p-3 w-56 ${
          alignRight ? 'right-0' : 'left-0'
        }`}>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="p-1 rounded hover:bg-[#2e2e2e] transition-colors text-[#8a8a8a] hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M7.5 2L3.5 6l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="text-white text-xs font-medium">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 rounded hover:bg-[#2e2e2e] transition-colors text-[#8a8a8a] hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4.5 2L8.5 6l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] text-[#4a4a4a] font-medium py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => (
              <div key={i} className="flex items-center justify-center">
                {day ? (
                  <button
                    onClick={() => handleSelectDay(day)}
                    className={`w-7 h-7 rounded text-xs transition-colors ${
                      isSelected(day)
                        ? 'bg-[#5e5ce6] text-white font-medium'
                        : isToday(day)
                        ? 'border border-[#5e5ce6] text-white hover:bg-[#2e2e2e]'
                        : isOverdue(day)
                        ? 'text-[#4a4a4a] hover:bg-[#2e2e2e] hover:text-white'
                        : 'text-[#c0c0c0] hover:bg-[#2e2e2e] hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                ) : (
                  <div className="w-7 h-7" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-[#2e2e2e] flex justify-between">
            <button
              onClick={() => {
                const today = new Date()
                onChange(today.toISOString().split('T')[0])
                setOpen(false)
              }}
              className="text-xs text-[#8a8a8a] hover:text-white transition-colors"
            >
              Today
            </button>
            {selectedDate && (
              <button
                onClick={handleClear}
                className="text-xs text-[#8a8a8a] hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
import { useState, useRef, useEffect } from 'react'

function Dropdown({ trigger, options, value, onChange, alignRight = false }) {
  const [open, setOpen] = useState(false)
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

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      {/* Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setOpen(!open)
        }}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className={`absolute z-50 mt-1 min-w-36 max-w-48 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg shadow-xl overflow-hidden ${
          alignRight ? 'right-0' : 'left-0'
        }`}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(option.value)
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-[#2e2e2e] transition-colors text-left ${
                value === option.value
                  ? 'text-white bg-[#242424]'
                  : 'text-[#c0c0c0]'
              }`}
            >
              {option.icon && (
                <span className="flex-shrink-0">{option.icon}</span>
              )}
              <span className="truncate">{option.label}</span>
              {value === option.value && (
                <span className="ml-auto flex-shrink-0 text-[#5e5ce6]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
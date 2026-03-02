import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import KeyboardShortcutsModal from './KeyboardShortcutsModal'
import useKeyboardShortcut from '../hooks/useKeyboardShortcut'

function Layout({ children }) {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const navigate = useNavigate()

  // Show keyboard shortcuts modal
  useKeyboardShortcut('?', () => setShowShortcuts((prev) => !prev))

  // Navigation shortcuts
  useKeyboardShortcut('g', () => {
    const handleSecondKey = (e) => {
      if (e.key === 'i') navigate('/issues')
      if (e.key === 'p') navigate('/profile')
      if (e.key === 'w') navigate('/workspace')
      window.removeEventListener('keydown', handleSecondKey)
    }
    window.addEventListener('keydown', handleSecondKey)

    // Clean up after 1 second if no second key is pressed
    setTimeout(() => {
      window.removeEventListener('keydown', handleSecondKey)
    }, 1000)
  })

  return (
    <div className="flex h-screen bg-[#0f0f0f] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  )
}

export default Layout
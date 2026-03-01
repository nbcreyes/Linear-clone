import { useEffect } from 'react'

const useKeyboardShortcut = (key, callback) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not trigger if user is typing in an input, textarea, or select
      const activeElement = document.activeElement
      const isTyping =
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable

      if (isTyping) return

      if (e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [key, callback])
}

export default useKeyboardShortcut
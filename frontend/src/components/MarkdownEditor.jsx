import { useState } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

const toolbarItems = [
  { label: 'B', title: 'Bold', syntax: '**', wrap: true, className: 'font-bold' },
  { label: 'I', title: 'Italic', syntax: '_', wrap: true, className: 'italic' },
  { label: '`', title: 'Inline code', syntax: '`', wrap: true, className: 'font-mono text-xs' },
  { label: 'H1', title: 'Heading', syntax: '# ', wrap: false, className: 'text-xs' },
  { label: '—', title: 'Divider', syntax: null, wrap: false, className: '' },
  { label: '•', title: 'Bullet list', syntax: '- ', wrap: false, className: '' },
  { label: '1.', title: 'Numbered list', syntax: '1. ', wrap: false, className: 'text-xs' },
  { label: '❝', title: 'Blockquote', syntax: '> ', wrap: false, className: '' },
]

function MarkdownEditor({ value, onChange, onSave, onCancel, placeholder = 'Write something...', rows = 6 }) {
  const [tab, setTab] = useState('write')

  const handleToolbarClick = (item, e) => {
    e.preventDefault()
    if (!item.syntax) return

    const textarea = document.getElementById('md-editor')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)

    let newValue
    let newCursorPos

    if (item.wrap) {
      newValue = value.substring(0, start) + item.syntax + selected + item.syntax + value.substring(end)
      newCursorPos = selected
        ? end + item.syntax.length * 2
        : start + item.syntax.length
    } else {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      newValue = value.substring(0, lineStart) + item.syntax + value.substring(lineStart)
      newCursorPos = start + item.syntax.length
    }

    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="border border-[#2e2e2e] rounded-lg overflow-hidden focus-within:border-[#5e5ce6] transition-colors">

      {/* Tabs */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#2e2e2e] bg-[#1a1a1a]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              tab === 'write'
                ? 'bg-[#242424] text-white'
                : 'text-[#8a8a8a] hover:text-white'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              tab === 'preview'
                ? 'bg-[#242424] text-white'
                : 'text-[#8a8a8a] hover:text-white'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Toolbar — only show on write tab */}
        {tab === 'write' && (
          <div className="flex items-center gap-0.5">
            {toolbarItems.map((item, i) =>
              item.label === '—' ? (
                <div key={i} className="w-px h-4 bg-[#2e2e2e] mx-1" />
              ) : (
                <button
                  key={i}
                  type="button"
                  title={item.title}
                  onMouseDown={(e) => handleToolbarClick(item, e)}
                  className={`w-6 h-6 flex items-center justify-center rounded text-[#8a8a8a] hover:text-white hover:bg-[#242424] transition-colors ${item.className}`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Editor */}
      {tab === 'write' ? (
        <textarea
          id="md-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && onCancel) onCancel()
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && onSave) onSave()
          }}
          placeholder={placeholder}
          rows={rows}
          autoFocus
          className="w-full bg-[#1a1a1a] text-white text-sm px-3 py-2 outline-none placeholder-[#4a4a4a] resize-none"
        />
      ) : (
        <div className="min-h-24 px-3 py-2 bg-[#1a1a1a]">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-[#4a4a4a] text-sm">Nothing to preview</p>
          )}
        </div>
      )}

      {/* Footer */}
      {(onSave || onCancel) && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#2e2e2e] bg-[#1a1a1a]">
          <span className="text-[10px] text-[#4a4a4a]">
            Markdown supported · Ctrl+Enter to save
          </span>
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-[#8a8a8a] hover:text-white transition-colors px-2 py-1 rounded hover:bg-[#242424]"
              >
                Cancel
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="text-xs bg-[#5e5ce6] hover:bg-[#4f4dd4] text-white px-3 py-1 rounded transition-colors"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MarkdownEditor
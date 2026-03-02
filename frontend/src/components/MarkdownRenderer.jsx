import ReactMarkdown from 'react-markdown'

function MarkdownRenderer({ content }) {
  if (!content) return null

  return (
    <div className="markdown">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg font-semibold text-white mb-2 mt-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold text-white mb-2 mt-4 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold text-white mb-1 mt-3 first:mt-0">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-sm text-[#c0c0c0] mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#c0c0c0]">{children}</em>
          ),
          code: ({ inline, children }) => (
            inline
              ? <code className="bg-[#2e2e2e] text-[#c0c0c0] px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
              : <pre className="bg-[#242424] border border-[#2e2e2e] rounded p-3 overflow-x-auto my-2">
                  <code className="text-[#c0c0c0] text-xs font-mono">{children}</code>
                </pre>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-sm text-[#c0c0c0] mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-sm text-[#c0c0c0] mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-[#c0c0c0]">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#5e5ce6] pl-3 my-2 text-[#8a8a8a] italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5e5ce6] hover:underline"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-[#2e2e2e] my-3" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
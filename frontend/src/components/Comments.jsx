import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useGetComments, useCreateComment, useDeleteComment } from '../hooks/useComments'
import useAuthStore from '../store/authStore'
import socket from '../lib/socket'
import MarkdownRenderer from './MarkdownRenderer'
import MarkdownEditor from './MarkdownEditor'

function Comments({ issueId }) {
  const [body, setBody] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)

  const { data: comments, isLoading } = useGetComments(issueId)
  const { mutate: createComment, isPending } = useCreateComment(issueId)
  const { mutate: deleteComment } = useDeleteComment(issueId)

  // Real-time comments
  useEffect(() => {
    if (!issueId) return

    socket.on(`comment:created:${issueId}`, (newComment) => {
      queryClient.setQueryData(['comments', issueId], (old) => {
        if (!old) return [newComment]
        const exists = old.some((c) => c._id === newComment._id)
        if (exists) return old
        return [...old, newComment]
      })
    })

    socket.on(`comment:deleted:${issueId}`, (deletedId) => {
      queryClient.setQueryData(['comments', issueId], (old) => {
        if (!old) return old
        return old.filter((c) => c._id !== deletedId)
      })
    })

    return () => {
      socket.off(`comment:created:${issueId}`)
      socket.off(`comment:deleted:${issueId}`)
    }
  }, [issueId, queryClient])

  const handleSubmit = () => {
    if (!body.trim()) return
    createComment(body, {
      onSuccess: () => {
        setBody('')
        setIsFocused(false)
      },
    })
  }

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

  return (
    <div className="mt-8">

      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xs font-medium text-[#8a8a8a] uppercase tracking-wider">
          Comments
        </h3>
        {comments?.length > 0 && (
          <span className="text-xs text-[#8a8a8a] bg-[#242424] px-1.5 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-4 mb-6">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#242424] animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-2.5 bg-[#242424] rounded animate-pulse" />
                  <div className="w-full h-2.5 bg-[#242424] rounded animate-pulse" />
                  <div className="w-3/4 h-2.5 bg-[#242424] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && comments?.length === 0 && (
          <p className="text-xs text-[#4a4a4a] py-2">
            No comments yet. Be the first to comment.
          </p>
        )}

        {!isLoading && comments?.map((comment) => (
          <div key={comment._id} className="flex gap-3 group">

            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-[#5e5ce6] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-medium">
                {comment.author?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-white">
                  {comment.author?.name}
                </span>
                <span className="text-[10px] text-[#4a4a4a]">
                  {formatTime(comment.createdAt)}
                </span>

                {/* Delete button — only show for comment author */}
                {comment.author?._id === user?._id && (
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-[#4a4a4a] hover:text-red-400 transition-all text-[10px]"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Markdown rendered comment body */}
              <div className="mt-1">
                <MarkdownRenderer content={comment.body} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comment input */}
      <div className="flex gap-3">

        {/* Current user avatar */}
        <div className="w-7 h-7 rounded-full bg-[#5e5ce6] flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-[10px] font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Input area */}
        <div className="flex-1">
          {isFocused ? (
            <MarkdownEditor
              value={body}
              onChange={setBody}
              onSave={handleSubmit}
              onCancel={() => {
                setBody('')
                setIsFocused(false)
              }}
              placeholder="Add a comment... Markdown is supported"
              rows={3}
            />
          ) : (
            <div
              onClick={() => setIsFocused(true)}
              className="px-3 py-2 border border-[#2e2e2e] rounded-lg text-sm text-[#4a4a4a] cursor-text hover:border-[#3e3e3e] transition-colors bg-[#1a1a1a]"
            >
              Add a comment...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Comments
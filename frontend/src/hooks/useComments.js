import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import useWorkspaceStore from '../store/workspaceStore'
import toast from 'react-hot-toast'

export const useGetComments = (issueId) => {
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useQuery({
    queryKey: ['comments', issueId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/issues/${issueId}/comments`
      )
      return data
    },
    enabled: !!workspaceId && !!issueId,
  })
}

export const useCreateComment = (issueId) => {
  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useMutation({
    mutationFn: async (body) => {
      const { data } = await axiosInstance.post(
        `/workspaces/${workspaceId}/issues/${issueId}/comments`,
        { body }
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', issueId] })
    },
    onError: () => {
      toast.error('Failed to post comment')
    },
  })
}

export const useDeleteComment = (issueId) => {
  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useMutation({
    mutationFn: async (commentId) => {
      const { data } = await axiosInstance.delete(
        `/workspaces/${workspaceId}/issues/${issueId}/comments/${commentId}`
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', issueId] })
      toast.success('Comment deleted')
    },
    onError: () => {
      toast.error('Failed to delete comment')
    },
  })
}
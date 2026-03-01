import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import useWorkspaceStore from '../store/workspaceStore'
import toast from 'react-hot-toast'

export const useGetIssues = () => {
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useQuery({
    queryKey: ['issues', workspaceId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/issues`
      )
      return data
    },
    enabled: !!workspaceId,
  })
}

export const useCreateIssue = () => {
  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useMutation({
    mutationFn: async (issueData) => {
      const { data } = await axiosInstance.post(
        `/workspaces/${workspaceId}/issues`,
        issueData
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] })
      toast.success('Issue created')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create issue')
    },
  })
}

export const useUpdateIssue = () => {
  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useMutation({
    mutationFn: async ({ id, ...issueData }) => {
      const { data } = await axiosInstance.put(
        `/workspaces/${workspaceId}/issues/${id}`,
        issueData
      )
      return data
    },
    onSuccess: (updatedIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] })
      queryClient.setQueryData(['issue', updatedIssue._id], updatedIssue)
      toast.success('Issue updated')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update issue')
    },
  })
}

export const useDeleteIssue = () => {
  const queryClient = useQueryClient()
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(
        `/workspaces/${workspaceId}/issues/${id}`
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] })
      toast.success('Issue deleted')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete issue')
    },
  })
}
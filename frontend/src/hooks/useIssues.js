import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import useWorkspaceStore from '../store/workspaceStore'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', workspaceId] })
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
    },
  })
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import useWorkspaceStore from '../store/workspaceStore'
import toast from 'react-hot-toast'

export const useGetUserWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/workspaces')
      return data
    },
  })
}

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace)

  return useMutation({
    mutationFn: async (name) => {
      const { data } = await axiosInstance.post('/workspaces', { name })
      return data
    },
    onSuccess: (data) => {
      setWorkspace(data)
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      toast.success('Workspace created')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create workspace')
    },
  })
}

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient()
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace)

  return useMutation({
    mutationFn: async (inviteCode) => {
      const { data } = await axiosInstance.post('/workspaces/join', {
        inviteCode,
      })
      return data
    },
    onSuccess: (data) => {
      setWorkspace(data)
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
      toast.success('Joined workspace')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to join workspace')
    },
  })
}

export const useGetWorkspaceMembers = () => {
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/workspaces/${workspaceId}`)
      return data.members
    },
    enabled: !!workspaceId,
  })
}
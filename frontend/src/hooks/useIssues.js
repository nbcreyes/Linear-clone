import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'

export const useGetIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/issues')
      return data
    },
  })
}

export const useCreateIssue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (issueData) => {
      const { data } = await axiosInstance.post('/issues', issueData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })
}

export const useUpdateIssue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...issueData }) => {
      const { data } = await axiosInstance.put(`/issues/${id}`, issueData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })
}

export const useDeleteIssue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/issues/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })
}
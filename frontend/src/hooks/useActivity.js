import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../lib/axios'
import useWorkspaceStore from '../store/workspaceStore'

export const useGetActivity = (issueId) => {
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?._id)

  return useQuery({
    queryKey: ['activity', issueId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/workspaces/${workspaceId}/issues/${issueId}/activity`
      )
      return data
    },
    enabled: !!workspaceId && !!issueId,
  })
}
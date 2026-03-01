import { Navigate } from 'react-router-dom'
import useWorkspaceStore from '../store/workspaceStore'

function WorkspaceRoute({ children }) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace)

  if (!currentWorkspace) {
    return <Navigate to='/workspace' />
  }

  return children
}

export default WorkspaceRoute
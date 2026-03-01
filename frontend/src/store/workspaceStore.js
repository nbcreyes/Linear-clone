import { create } from 'zustand'

const useWorkspaceStore = create((set) => ({
  currentWorkspace: JSON.parse(localStorage.getItem('workspace')) || null,

  setWorkspace: (workspace) => {
    localStorage.setItem('workspace', JSON.stringify(workspace))
    set({ currentWorkspace: workspace })
  },

  clearWorkspace: () => {
    localStorage.removeItem('workspace')
    set({ currentWorkspace: null })
  },
}))

export default useWorkspaceStore
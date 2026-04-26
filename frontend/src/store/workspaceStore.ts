import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { workspacesApi, type Workspace } from '@/api/workspaces'

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspaceId: string | null  // null = personal (no workspace)
  loading: boolean

  fetch: () => Promise<void>
  setActive: (id: string | null) => void
  addWorkspace: (name: string) => Promise<Workspace>
  removeWorkspace: (id: string) => Promise<void>
  renameWorkspace: (id: string, name: string) => Promise<void>
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      workspaces: [],
      activeWorkspaceId: null,
      loading: false,

      fetch: async () => {
        set({ loading: true })
        try {
          const workspaces = await workspacesApi.list()
          set({ workspaces })
        } finally {
          set({ loading: false })
        }
      },

      setActive: (id) => set({ activeWorkspaceId: id }),

      addWorkspace: async (name) => {
        const ws = await workspacesApi.create(name)
        set(s => ({ workspaces: [...s.workspaces, ws], activeWorkspaceId: ws.id }))
        return ws
      },

      removeWorkspace: async (id) => {
        await workspacesApi.delete(id)
        set(s => ({
          workspaces: s.workspaces.filter(w => w.id !== id),
          activeWorkspaceId: s.activeWorkspaceId === id ? null : s.activeWorkspaceId,
        }))
      },

      renameWorkspace: async (id, name) => {
        const updated = await workspacesApi.update(id, name)
        set(s => ({
          workspaces: s.workspaces.map(w => w.id === id ? { ...w, name: updated.name } : w),
        }))
      },
    }),
    {
      name: 'formcraft-workspace',
      partialPersist: (state) => ({ activeWorkspaceId: state.activeWorkspaceId }),
    } as Parameters<typeof persist>[1]
  )
)

export function useActiveWorkspace() {
  const { workspaces, activeWorkspaceId } = useWorkspaceStore()
  return workspaces.find(w => w.id === activeWorkspaceId) ?? null
}

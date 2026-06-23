import { create } from 'zustand'

interface UiStoreState {
  sidebarCollapsed: boolean
  activeWorkspaceId: string
  toggleSidebar: () => void
  setActiveWorkspaceId: (workspaceId: string) => void
}

export const useUiStore = create<UiStoreState>((set) => ({
  sidebarCollapsed: false,
  activeWorkspaceId: 'ws-1',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveWorkspaceId: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
}))
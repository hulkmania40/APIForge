import { create } from 'zustand'

interface UiStoreState {
  sidebarCollapsed: boolean
  activeWorkspaceId: string
  theme: 'light' | 'dark'
  toggleSidebar: () => void
  setActiveWorkspaceId: (workspaceId: string) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const getInitialTheme = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (saved === 'light' || saved === 'dark') return saved
  return 'dark' // default theme
}

export const useUiStore = create<UiStoreState>((set) => ({
  sidebarCollapsed: false,
  activeWorkspaceId: 'ws-api-forge',
  theme: getInitialTheme(),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveWorkspaceId: (workspaceId) => set({ activeWorkspaceId: workspaceId }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    set({ theme })
  },
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return { theme: nextTheme }
  }),
}))
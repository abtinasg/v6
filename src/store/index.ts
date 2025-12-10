import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Chat, Message } from '@/types';
import type { ChatMode } from '@/lib/models';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  
  // Chat
  chats: Chat[];
  currentChatId: string | null;
  messages: Message[];
  selectedModels: string[];
  currentMode: ChatMode;
  
  // UI
  sidebarOpen: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setShowAuthModal: (show: boolean) => void;
  setChats: (chats: Chat[]) => void;
  setCurrentChat: (chatId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setSelectedModels: (models: string[]) => void;
  setCurrentMode: (mode: ChatMode) => void;
  setSidebarOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  logout: () => void;
  updateCredits: (credits: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      showAuthModal: false,
      chats: [],
      currentChatId: null,
      messages: [],
      selectedModels: ['gpt-5.1'],
      currentMode: 'chat',
      sidebarOpen: false,
      isLoading: false,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setShowAuthModal: (show) => set({ showAuthModal: show }),
      setChats: (chats) => set({ chats }),
      setCurrentChat: (chatId) => set({ currentChatId: chatId }),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      setSelectedModels: (models) => set({ selectedModels: models }),
      setCurrentMode: (mode) => set({ currentMode: mode }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      logout: () => set({ user: null, isAuthenticated: false, chats: [], messages: [], currentChatId: null }),
      updateCredits: (credits) => set((state) => state.user ? { user: { ...state.user, credits } } : {}),
    }),
    {
      name: 'ai-app-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedModels: state.selectedModels,
        currentMode: state.currentMode,
      }),
    }
  )
);

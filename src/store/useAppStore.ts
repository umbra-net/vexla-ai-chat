/**
 * ==========================================
 * VEXLA UMBRIC - Zustand 统一状态管理
 * ==========================================
 *
 * 使用Zustand + Immer实现高性能、类型安全的状态管理
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Artifact } from '../components/EnhancedArtifactModal';
import type { IslandMessageType, IslandMode } from '../components/EnhancedDynamicIsland';
import { AI_RESPONSES, SAMPLE_ARTIFACTS } from '../constants';

// ==========================================
// 类型定义
// ==========================================

export type View = 'home' | 'chat';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  hasImage?: boolean;
  artifactId?: string;
  timestamp: number;
}

export interface IslandNotification {
  show: boolean;
  message: string;
  type: IslandMessageType;
  autoDismiss: boolean;
  dismissDelay: number;
}

// ==========================================
// State Interface
// ==========================================

interface AppState {
  // View State
  currentView: View;

  // Chat State
  messages: Message[];
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  isTyping: boolean;
  showWeatherCard: boolean;

  // Modal State
  isArtifactModalOpen: boolean;
  isSettingsOpen: boolean;
  isModelSelectorOpen: boolean;
  isBrowserOpen: boolean;
  isSidebarOpen: boolean;
  browserUrl: string;

  // Island State
  islandMode: IslandMode;
  isRecording: boolean;
  showWelcomeIsland: boolean;
  islandNotification: IslandNotification;

  // User Preferences
  selectedModel: string;
  selectedCategory: string;
}

// ==========================================
// Actions Interface
// ==========================================

interface AppActions {
  // View Actions
  setCurrentView: (view: View) => void;

  // Chat Actions
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setTyping: (isTyping: boolean) => void;
  addArtifact: (artifact: Artifact) => void;

  // Modal Actions
  openArtifactModal: (artifact: Artifact) => void;
  closeArtifactModal: () => void;
  toggleSettings: (open?: boolean) => void;
  toggleModelSelector: (open?: boolean) => void;
  openBrowser: (url: string) => void;
  closeBrowser: () => void;
  toggleSidebar: (open?: boolean) => void;

  // Island Actions
  setIslandMode: (mode: IslandMode) => void;
  setRecording: (recording: boolean) => void;
  setShowWelcomeIsland: (show: boolean) => void;
  showNotification: (message: string, type: IslandMessageType, dismissDelay?: number) => void;
  hideNotification: () => void;

  // Preferences
  setSelectedModel: (model: string) => void;
  setSelectedCategory: (category: string) => void;
  setShowWeatherCard: (show: boolean) => void;

  // Composite Actions
  startNewChat: () => void;
  sendMessage: (text: string, source?: 'island' | 'chat' | 'voice' | 'fab') => void;
  handleStartChat: () => void;
  handleFeatureClick: (featureName: string, type?: IslandMessageType) => void;
  handleVoiceClick: () => void;
  handleViewArtifact: (artifactId: string) => void;
}

// ==========================================
// 默认值
// ==========================================

const DEFAULT_ISLAND_NOTIFICATION: IslandNotification = {
  show: false,
  message: '',
  type: 'info',
  autoDismiss: true,
  dismissDelay: 3000,
};

// ==========================================
// Zustand Store
// ==========================================

export const useAppStore = create<AppState & AppActions>()(
  immer((set, get) => ({
    // Initial State
    currentView: 'home',
    messages: [],
    artifacts: [],
    selectedArtifact: null,
    isTyping: false,
    showWeatherCard: false,

    isArtifactModalOpen: false,
    isSettingsOpen: false,
    isModelSelectorOpen: false,
    isBrowserOpen: false,
    isSidebarOpen: false,
    browserUrl: '',

    islandMode: 'idle',
    isRecording: false,
    showWelcomeIsland: true,
    islandNotification: DEFAULT_ISLAND_NOTIFICATION,

    selectedModel: 'vexla-ultra',
    selectedCategory: 'All modes',

    // ==========================================
    // View Actions
    // ==========================================

    setCurrentView: (view) => set({ currentView: view }),

    // ==========================================
    // Chat Actions
    // ==========================================

    addMessage: (message) => set((state) => {
      state.messages.push(message);
    }),

    clearMessages: () => set({
      messages: [],
      artifacts: [],
      showWeatherCard: false
    }),

    setTyping: (isTyping) => set({ isTyping }),

    addArtifact: (artifact) => set((state) => {
      const exists = state.artifacts.find(a => a.id === artifact.id);
      if (!exists) {
        state.artifacts.push(artifact);
      }
    }),

    // ==========================================
    // Modal Actions
    // ==========================================

    openArtifactModal: (artifact) => set({
      selectedArtifact: artifact,
      isArtifactModalOpen: true,
    }),

    closeArtifactModal: () => set({
      isArtifactModalOpen: false,
      selectedArtifact: null,
    }),

    toggleSettings: (open) => set((state) => ({
      isSettingsOpen: open ?? !state.isSettingsOpen,
    })),

    toggleModelSelector: (open) => set((state) => ({
      isModelSelectorOpen: open ?? !state.isModelSelectorOpen,
    })),

    openBrowser: (url) => set({
      isBrowserOpen: true,
      browserUrl: url,
    }),

    closeBrowser: () => set({
      isBrowserOpen: false,
      browserUrl: '',
    }),

    toggleSidebar: (open) => set((state) => ({
      isSidebarOpen: open ?? !state.isSidebarOpen,
    })),

    // ==========================================
    // Island Actions
    // ==========================================

    setIslandMode: (mode) => set({ islandMode: mode }),

    setRecording: (recording) => set({ isRecording: recording }),

    setShowWelcomeIsland: (show) => set({ showWelcomeIsland: show }),

    showNotification: (message, type, dismissDelay = 3000) => set({
      islandNotification: {
        show: true,
        message,
        type,
        autoDismiss: true,
        dismissDelay,
      },
    }),

    hideNotification: () => set((state) => {
      state.islandNotification.show = false;
    }),

    // ==========================================
    // Preferences
    // ==========================================

    setSelectedModel: (model) => set({ selectedModel: model }),

    setSelectedCategory: (category) => set({ selectedCategory: category }),

    setShowWeatherCard: (show) => set({ showWeatherCard: show }),

    // ==========================================
    // Composite Actions
    // ==========================================

    startNewChat: () => set({
      messages: [],
      artifacts: [],
      showWeatherCard: false,
      currentView: 'home',
      islandMode: 'idle',
      showWelcomeIsland: true,
    }),

    handleStartChat: () => {
      set({ currentView: 'chat', showWelcomeIsland: false });
    },

    handleFeatureClick: (featureName, type = 'chat') => {
      get().showNotification(`Opening ${featureName}...`, type, 2000);
      setTimeout(() => {
        get().handleStartChat();
      }, 500);
    },

    handleVoiceClick: () => {
      const currentRecording = get().isRecording;
      const newRecordingState = !currentRecording;

      set({ isRecording: newRecordingState });

      if (newRecordingState) {
        set({ islandMode: 'awakening' });

        if (get().currentView === 'home') {
          get().handleStartChat();
        }

        get().showNotification('Awakening...', 'loading', 0);

        setTimeout(() => {
          set({ islandMode: 'listening' });
          get().showNotification('Listening...', 'loading', 0);
        }, 1000);

        // Auto stop after 30 seconds
        setTimeout(() => {
          set({ isRecording: false, islandMode: 'idle' });
          get().hideNotification();
        }, 30000);
      } else {
        set({ islandMode: 'idle' });
        get().hideNotification();
      }
    },

    handleViewArtifact: (artifactId) => {
      const artifact = get().artifacts.find(a => a.id === artifactId);
      if (artifact) {
        get().openArtifactModal(artifact);
      }
    },

    sendMessage: (text, source = 'chat') => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser: true,
        timestamp: Date.now(),
      };

      get().addMessage(newMessage);

      if (get().currentView !== 'chat') {
        set({ currentView: 'chat', showWelcomeIsland: false });
      }

      if (source === 'island') {
        set({ islandMode: 'processing' });
        get().showNotification('Processing your request...', 'loading', 0);
      }

      const textLower = text.toLowerCase();
      set({ isTyping: true });

      // Weather request
      if (textLower.includes('weather') || textLower.includes('temperature') || textLower.includes('forecast')) {
        setTimeout(() => {
          const response: Message = {
            id: (Date.now() + 1).toString(),
            text: "Here's the current weather information for you:",
            isUser: false,
            timestamp: Date.now(),
          };
          get().addMessage(response);
          set({ isTyping: false, showWeatherCard: true });

          if (source === 'island') {
            set({ islandMode: 'idle' });
            get().hideNotification();
          }
        }, 1500);
        return;
      }

      // Browser request
      if (textLower.includes('open') && (textLower.includes('youtube') || textLower.includes('website') || textLower.includes('browser'))) {
        get().showNotification('Opening browser...', 'browser', 0);

        setTimeout(() => {
          get().showNotification('Browser opened!', 'success', 2000);
          get().openBrowser('https://youtube.com');

          const response: Message = {
            id: (Date.now() + 1).toString(),
            text: "I've opened the browser for you. You can now browse YouTube.",
            isUser: false,
            timestamp: Date.now(),
          };
          get().addMessage(response);
          set({ isTyping: false });

          if (source === 'island') {
            set({ islandMode: 'idle' });
          }
        }, 2000);
        return;
      }

      // Normal AI response with artifacts
      setTimeout(() => {
        const hasCodeRequest = textLower.includes('code') || textLower.includes('component') || textLower.includes('react');
        const hasTodoRequest = textLower.includes('todo') || textLower.includes('task');
        const hasPoemRequest = textLower.includes('poem') || textLower.includes('poetry');

        let artifactId: string | undefined;
        let responseText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

        if (hasCodeRequest && !hasTodoRequest) {
          artifactId = 'react-component';
          responseText = "I've created a React counter component for you. Check out the artifact below:";
          const artifact = SAMPLE_ARTIFACTS['react-component'];
          get().addArtifact(artifact);
        } else if (hasTodoRequest) {
          artifactId = 'todo-app';
          responseText = "Here's a complete Todo List application with HTML, CSS, and JavaScript:";
          const artifact = SAMPLE_ARTIFACTS['todo-app'];
          get().addArtifact(artifact);
        } else if (hasPoemRequest) {
          artifactId = 'poem';
          responseText = "I've written a poem for you. Here it is:";
          const artifact = SAMPLE_ARTIFACTS['poem'];
          get().addArtifact(artifact);
        }

        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isUser: false,
          hasImage: textLower.includes('image') || textLower.includes('picture'),
          artifactId,
          timestamp: Date.now(),
        };

        get().addMessage(response);
        set({ isTyping: false });

        if (source === 'island') {
          set({ islandMode: 'idle' });
          get().hideNotification();
        }
      }, 1500);
    },
  }))
);

// ==========================================
// Selectors (for performance optimization)
// ==========================================

export const selectMessages = (state: AppState & AppActions) => state.messages;
export const selectArtifacts = (state: AppState & AppActions) => state.artifacts;
export const selectIsTyping = (state: AppState & AppActions) => state.isTyping;
export const selectCurrentView = (state: AppState & AppActions) => state.currentView;
export const selectIslandMode = (state: AppState & AppActions) => state.islandMode;
export const selectIslandNotification = (state: AppState & AppActions) => state.islandNotification;
export const selectShowWelcomeIsland = (state: AppState & AppActions) => state.showWelcomeIsland;
export const selectIsRecording = (state: AppState & AppActions) => state.isRecording;

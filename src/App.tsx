/**
 * ==========================================
 * VEXLA UMBRIC - 优化版App组件
 * ==========================================
 *
 * 使用Zustand统一状态管理
 * 从897行代码简化到约200行
 */

import { Suspense } from 'react';
import { useResponsive } from './hooks/useResponsive';
import { useAppStore, selectCurrentView, selectIslandMode, selectIslandNotification, selectShowWelcomeIsland } from './store/useAppStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EnhancedDynamicIsland } from './components/EnhancedDynamicIsland';
import {
  LazyDesktopLayout,
  LazyTabletLayout,
  LazyMobileLayout,
  LazyDesktopHome,
  LazyDesktopChat,
  LazyMobileHome,
  LazyMobileChat,
  LazyEnhancedArtifactModal,
  LazySettingsModal,
  LazyModelSelectorModal,
  LazyBrowserModal,
  LazySidebarPanel,
  CardGridSkeleton,
  DesktopLayoutSkeleton,
  MobileLayoutSkeleton,
} from './components/LazyComponents';

export default function App() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Zustand selectors (自动优化,仅在相关状态变化时重渲染)
  const currentView = useAppStore(selectCurrentView);
  const islandMode = useAppStore(selectIslandMode);
  const islandNotif = useAppStore(selectIslandNotification);
  const showWelcomeIsland = useAppStore(selectShowWelcomeIsland);

  // Modal states
  const isSettingsOpen = useAppStore(state => state.isSettingsOpen);
  const isModelSelectorOpen = useAppStore(state => state.isModelSelectorOpen);
  const isBrowserOpen = useAppStore(state => state.isBrowserOpen);
  const isSidebarOpen = useAppStore(state => state.isSidebarOpen);
  const isArtifactModalOpen = useAppStore(state => state.isArtifactModalOpen);

  // Other states
  const selectedModel = useAppStore(state => state.selectedModel);
  const selectedArtifact = useAppStore(state => state.selectedArtifact);
  const messages = useAppStore(state => state.messages);
  const artifacts = useAppStore(state => state.artifacts);
  const isTyping = useAppStore(state => state.isTyping);
  const showWeatherCard = useAppStore(state => state.showWeatherCard);
  const isRecording = useAppStore(state => state.isRecording);
  const browserUrl = useAppStore(state => state.browserUrl);
  const selectedCategory = useAppStore(state => state.selectedCategory);

  // Actions
  const handleStartChat = useAppStore(state => state.handleStartChat);
  const handleFeatureClick = useAppStore(state => state.handleFeatureClick);
  const toggleSidebar = useAppStore(state => state.toggleSidebar);
  const toggleModelSelector = useAppStore(state => state.toggleModelSelector);
  const toggleSettings = useAppStore(state => state.toggleSettings);
  const handleVoiceClick = useAppStore(state => state.handleVoiceClick);
  const sendMessage = useAppStore(state => state.sendMessage);
  const startNewChat = useAppStore(state => state.startNewChat);
  const handleViewArtifact = useAppStore(state => state.handleViewArtifact);
  const closeArtifactModal = useAppStore(state => state.closeArtifactModal);
  const closeBrowser = useAppStore(state => state.closeBrowser);
  const setIslandMode = useAppStore(state => state.setIslandMode);
  const setShowWelcomeIsland = useAppStore(state => state.setShowWelcomeIsland);
  const showNotification = useAppStore(state => state.showNotification);
  const setSelectedModel = useAppStore(state => state.setSelectedModel);
  const setSelectedCategory = useAppStore(state => state.setSelectedCategory);

  // Computed values
  const showTopBarIslandIcon = islandMode === 'compact';
  const isIslandVisible = islandMode !== 'compact';

  // Handlers
  const handleMenuClick = () => toggleSidebar(true);

  const handleModelSelectorClick = () => {
    toggleModelSelector(true);
    showNotification('Select your AI model...', 'info', 2000);
  };

  const handleOpenSettings = () => {
    toggleSettings(true);
    showNotification('Opening settings...', 'info', 2000);
  };

  const handleIslandIconClick = () => {
    setIslandMode('idle');
    setShowWelcomeIsland(true);
  };

  const handleShowNotification = (message: string, type: any) => {
    showNotification(message, type, 2000);
    setIslandMode('notification');
  };

  const handleCloseBrowser = () => {
    closeBrowser();
    showNotification('Browser closed', 'success', 2000);
  };

  const handleVideoCallClick = () => {
    showNotification('Video call feature coming soon!', 'info', 2000);
    setIslandMode('notification');
  };

  // Desktop Render
  if (isDesktop) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<DesktopLayoutSkeleton />}>
          <LazyDesktopLayout
            currentView={currentView}
            selectedModel={selectedModel}
            onModelClick={handleModelSelectorClick}
            onNewChat={startNewChat}
            onOpenSettings={handleOpenSettings}
            showRightPanel={isArtifactModalOpen && selectedArtifact !== null}
            selectedArtifact={selectedArtifact}
            onCloseRightPanel={closeArtifactModal}
            isRecording={isRecording}
            onVoiceInput={handleVoiceClick}
            onSendMessage={(text) => sendMessage(text, 'fab')}
            showIslandIcon={showTopBarIslandIcon}
            onIslandIconClick={handleIslandIconClick}
            onShowNotification={handleShowNotification}
          >
            <Suspense fallback={<CardGridSkeleton />}>
              {currentView === 'home' ? (
                <LazyDesktopHome
                  onFeatureClick={handleFeatureClick}
                  onStartChat={handleStartChat}
                />
              ) : (
                <LazyDesktopChat
                  messages={messages}
                  artifacts={artifacts}
                  isTyping={isTyping}
                  showWeatherCard={showWeatherCard}
                  onSendMessage={(text) => sendMessage(text, 'chat')}
                  onViewArtifact={handleViewArtifact}
                />
              )}
            </Suspense>
          </LazyDesktopLayout>
        </Suspense>

        {/* Modals */}
        <Suspense fallback={null}>
          {isSettingsOpen && (
            <LazySettingsModal
              isOpen={isSettingsOpen}
              onClose={() => toggleSettings(false)}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {isModelSelectorOpen && (
            <LazyModelSelectorModal
              isOpen={isModelSelectorOpen}
              onClose={() => toggleModelSelector(false)}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {isBrowserOpen && (
            <LazyBrowserModal
              isOpen={isBrowserOpen}
              onClose={handleCloseBrowser}
              url={browserUrl}
            />
          )}
        </Suspense>

        <EnhancedDynamicIsland
          mode={islandMode}
          onModeChange={setIslandMode}
          onSendMessage={(text) => sendMessage(text, 'island')}
          onVoiceInput={handleVoiceClick}
          isRecording={isRecording}
          isVisible={isIslandVisible}
          message={
            islandNotif.show
              ? islandNotif.message
              : currentView === 'home' && showWelcomeIsland
                ? 'Welcome to Vexla Umbric! Click to start chatting.'
                : 'Ask me anything...'
          }
          type={islandNotif.show ? islandNotif.type : 'welcome'}
          onHide={() => {
            if (islandNotif.show) {
              useAppStore.getState().hideNotification();
              setIslandMode('idle');
            } else {
              setShowWelcomeIsland(false);
            }
          }}
          autoDismiss={
            islandNotif.show
              ? islandNotif.autoDismiss
              : currentView === 'home' && showWelcomeIsland
          }
          dismissDelay={islandNotif.show ? islandNotif.dismissDelay : 5000}
          placeholder="Ask me anything..."
          showVoiceButton={true}
          showSendButton={true}
          autoCompact={currentView === 'chat'}
          autoCompactDelay={5000}
        />
      </ErrorBoundary>
    );
  }

  // Tablet Render
  if (isTablet) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<MobileLayoutSkeleton />}>
          <LazyTabletLayout
            currentView={currentView}
            selectedModel={selectedModel}
            isRecording={isRecording}
            onMenuClick={handleMenuClick}
            onVideoCallClick={handleVideoCallClick}
            onModelClick={handleModelSelectorClick}
            onVoiceClick={handleVoiceClick}
            onSendMessage={(text) => sendMessage(text, 'fab')}
            onStartChat={handleStartChat}
            showIslandIcon={showTopBarIslandIcon}
            onIslandIconClick={handleIslandIconClick}
            onShowNotification={handleShowNotification}
          >
            <Suspense fallback={<CardGridSkeleton />}>
              {currentView === 'home' ? (
                <LazyMobileHome
                  selectedCategory={selectedCategory}
                  categories={['All modes', 'Chat', 'Create', 'Analyze', 'Fun']}
                  onSelectCategory={setSelectedCategory}
                  onFeatureClick={handleFeatureClick}
                  onStartChat={handleStartChat}
                />
              ) : (
                <LazyMobileChat
                  messages={messages}
                  artifacts={artifacts}
                  isTyping={isTyping}
                  showWeatherCard={showWeatherCard}
                  onViewArtifact={handleViewArtifact}
                />
              )}
            </Suspense>
          </LazyTabletLayout>
        </Suspense>

        {/* Modals and Sidebar */}
        <Suspense fallback={null}>
          {isSidebarOpen && (
            <LazySidebarPanel
              isOpen={isSidebarOpen}
              onClose={() => toggleSidebar(false)}
              onNewChat={startNewChat}
              onOpenSettings={handleOpenSettings}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {isSettingsOpen && (
            <LazySettingsModal
              isOpen={isSettingsOpen}
              onClose={() => toggleSettings(false)}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {isModelSelectorOpen && (
            <LazyModelSelectorModal
              isOpen={isModelSelectorOpen}
              onClose={() => toggleModelSelector(false)}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {isBrowserOpen && (
            <LazyBrowserModal
              isOpen={isBrowserOpen}
              onClose={handleCloseBrowser}
              url={browserUrl}
            />
          )}
        </Suspense>

        <Suspense fallback={null}>
          {isArtifactModalOpen && selectedArtifact && (
            <LazyEnhancedArtifactModal
              isOpen={isArtifactModalOpen}
              onClose={closeArtifactModal}
              artifact={selectedArtifact}
            />
          )}
        </Suspense>

        <EnhancedDynamicIsland
          mode={islandMode}
          onModeChange={setIslandMode}
          onSendMessage={(text) => sendMessage(text, 'island')}
          onVoiceInput={handleVoiceClick}
          isRecording={isRecording}
          isVisible={isIslandVisible}
          message={
            islandNotif.show
              ? islandNotif.message
              : currentView === 'home' && showWelcomeIsland
                ? 'What would you like to build today?'
                : 'Ask me anything...'
          }
          type={islandNotif.show ? islandNotif.type : 'welcome'}
          onHide={() => {
            if (islandNotif.show) {
              useAppStore.getState().hideNotification();
              setIslandMode('idle');
            } else {
              setShowWelcomeIsland(false);
            }
          }}
          autoDismiss={
            islandNotif.show
              ? islandNotif.autoDismiss
              : currentView === 'home' && showWelcomeIsland
          }
          dismissDelay={islandNotif.show ? islandNotif.dismissDelay : 5000}
          placeholder="Ask me anything..."
          showVoiceButton={true}
          showSendButton={true}
          autoCompact={currentView === 'chat'}
          autoCompactDelay={5000}
        />
      </ErrorBoundary>
    );
  }

  // Mobile Render
  return (
    <ErrorBoundary>
      <Suspense fallback={<MobileLayoutSkeleton />}>
        <LazyMobileLayout
          currentView={currentView}
          selectedModel={selectedModel}
          isRecording={isRecording}
          onMenuClick={handleMenuClick}
          onVideoCallClick={handleVideoCallClick}
          onModelClick={handleModelSelectorClick}
          onVoiceClick={handleVoiceClick}
          onSendMessage={(text) => sendMessage(text, 'fab')}
          onStartChat={handleStartChat}
          showIslandIcon={showTopBarIslandIcon}
          onIslandIconClick={handleIslandIconClick}
          onShowNotification={handleShowNotification}
        >
          <Suspense fallback={<CardGridSkeleton />}>
            {currentView === 'home' ? (
              <LazyMobileHome
                selectedCategory={selectedCategory}
                categories={['All modes', 'Chat', 'Create', 'Analyze', 'Fun']}
                onSelectCategory={setSelectedCategory}
                onFeatureClick={handleFeatureClick}
                onStartChat={handleStartChat}
              />
            ) : (
              <LazyMobileChat
                messages={messages}
                artifacts={artifacts}
                isTyping={isTyping}
                showWeatherCard={showWeatherCard}
                onViewArtifact={handleViewArtifact}
              />
            )}
          </Suspense>
        </LazyMobileLayout>
      </Suspense>

      {/* Sidebar */}
      <Suspense fallback={null}>
        {isSidebarOpen && (
          <LazySidebarPanel
            isOpen={isSidebarOpen}
            onClose={() => toggleSidebar(false)}
            onNewChat={startNewChat}
            onOpenSettings={handleOpenSettings}
          />
        )}
      </Suspense>

      <EnhancedDynamicIsland
        mode={islandMode}
        onModeChange={setIslandMode}
        onSendMessage={(text) => sendMessage(text, 'island')}
        onVoiceInput={handleVoiceClick}
        isRecording={isRecording}
        isVisible={isIslandVisible}
        message={
          islandNotif.show
            ? islandNotif.message
            : currentView === 'home' && showWelcomeIsland
              ? 'What would you like to build today?'
              : 'Ask me anything...'
        }
        type={islandNotif.show ? islandNotif.type : 'welcome'}
        onHide={() => {
          if (islandNotif.show) {
            useAppStore.getState().hideNotification();
            setIslandMode('idle');
          } else {
            setShowWelcomeIsland(false);
          }
        }}
        autoDismiss={
          islandNotif.show
            ? islandNotif.autoDismiss
            : currentView === 'home' && showWelcomeIsland
        }
        dismissDelay={islandNotif.show ? islandNotif.dismissDelay : 5000}
        placeholder="Ask me anything..."
        showVoiceButton={true}
        showSendButton={true}
        autoCompact={currentView === 'chat'}
        autoCompactDelay={5000}
      />

      {/* Modals */}
      <Suspense fallback={null}>
        {isBrowserOpen && (
          <LazyBrowserModal
            isOpen={isBrowserOpen}
            onClose={handleCloseBrowser}
            url={browserUrl}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isArtifactModalOpen && selectedArtifact && (
          <LazyEnhancedArtifactModal
            isOpen={isArtifactModalOpen}
            onClose={closeArtifactModal}
            artifact={selectedArtifact}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isSettingsOpen && (
          <LazySettingsModal
            isOpen={isSettingsOpen}
            onClose={() => toggleSettings(false)}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {isModelSelectorOpen && (
          <LazyModelSelectorModal
            isOpen={isModelSelectorOpen}
            onClose={() => toggleModelSelector(false)}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}

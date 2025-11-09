import { ReactNode, useState, useEffect } from 'react';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopTopBar } from './DesktopTopBar';
import { DesktopRightPanel, Artifact } from './DesktopRightPanel';
import { FloatingActionButtons } from '../FloatingActionButtons';
import { RightPanelTrigger } from '../RightPanelTrigger';
import { useResponsive } from '../../hooks/useResponsive';

interface DesktopLayoutProps {
  children: ReactNode;
  currentView: 'home' | 'chat';
  selectedModel: string;
  onModelClick: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  showRightPanel?: boolean;
  selectedArtifact?: Artifact | null;
  onCloseRightPanel?: () => void;
  isRecording?: boolean;
  onVoiceInput?: () => void;
  onShowNotification?: (message: string, type: string) => void;
  onSendMessage?: (message: string) => void;
  showIslandIcon?: boolean;
  onIslandIconClick?: () => void;
}

export function DesktopLayout({
  children,
  currentView,
  selectedModel,
  onModelClick,
  onNewChat,
  onOpenSettings,
  showRightPanel = false,
  selectedArtifact,
  onCloseRightPanel,
  isRecording = false,
  onVoiceInput = () => {},
  showIslandIcon = false,
  onIslandIconClick = () => {},
  onShowNotification = () => {},
  onSendMessage,
}: DesktopLayoutProps) {
  const { windowSize } = useResponsive();
  
  // 根据屏幕宽度调整布局
  const isCompactDesktop = windowSize.width < 1440;
  
  // 右侧面板状态管理（触发式显示）
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  
  // 当 artifact 变化时，自动打开面板 - 使用 useEffect 避免无限循环
  useEffect(() => {
    if (selectedArtifact && selectedArtifact.id) {
      setIsRightPanelOpen(true);
    } else {
      setIsRightPanelOpen(false);
    }
  }, [selectedArtifact ? selectedArtifact.id : null]); // 稳定的依赖项
  
  // 关闭面板处理
  const handleCloseRightPanel = () => {
    setIsRightPanelOpen(false);
    setTimeout(() => {
      onCloseRightPanel?.();
    }, 300); // 等待动画完成
  };
  
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Left Sidebar */}
      <DesktopSidebar 
        currentView={currentView}
        onNewChat={onNewChat}
        onOpenSettings={onOpenSettings}
      />

      {/* Main Content Area - 动态宽度适配右侧面板 */}
      <div 
        className="flex-1 flex flex-col relative z-10 transition-all duration-300 ease-out"
        style={{
          marginRight: isRightPanelOpen && selectedArtifact ? '500px' : '0'
        }}
      >
        {/* Top Bar */}
        <DesktopTopBar
          selectedModel={selectedModel}
          onModelClick={onModelClick}
          currentView={currentView}
          showIslandIcon={showIslandIcon}
          onIslandIconClick={onIslandIconClick}
        />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>

      {/* 液态胶囊触发器 - 只在有 artifact 且面板未打开时显示 */}
      {!isRightPanelOpen && selectedArtifact && (
        <RightPanelTrigger
          onClick={() => setIsRightPanelOpen(true)}
          hasArtifact={!!selectedArtifact}
        />
      )}

      {/* Right Panel - 滑入式显示 */}
      {isRightPanelOpen && selectedArtifact && (
        <DesktopRightPanel 
          artifact={selectedArtifact}
          onClose={handleCloseRightPanel}
        />
      )}

      {/* Floating Action Buttons - Desktop (智能扩展输入系统) */}
      <FloatingActionButtons
        onSendMessage={onSendMessage}
        onTriggerIslandVoice={onVoiceInput}
        onNewChat={onNewChat}
        onShowNotification={onShowNotification}
        isRecording={isRecording}
      />
    </div>
  );
}

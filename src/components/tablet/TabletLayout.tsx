import { ReactNode } from 'react';
import { MobileTopBar } from '../MobileTopBar';
import { FloatingActionButtons } from '../FloatingActionButtons';
import { useResponsive } from '../../hooks/useResponsive';

interface TabletLayoutProps {
  children: ReactNode;
  currentView: 'home' | 'chat';
  selectedModel: string;
  isRecording: boolean;
  onMenuClick: () => void;
  onVideoCallClick?: () => void;
  onModelClick: () => void;
  onVoiceClick: () => void;
  onSendMessage?: (text: string) => void;
  onStartChat: () => void;
  onShowNotification?: (message: string, type: string) => void;
  showIslandIcon?: boolean;
  onIslandIconClick?: () => void;
}

export function TabletLayout({
  children,
  currentView,
  selectedModel,
  isRecording,
  onMenuClick,
  onVideoCallClick,
  onModelClick,
  onVoiceClick,
  onSendMessage,
  onStartChat,
  onShowNotification,
  showIslandIcon = false,
  onIslandIconClick = () => {},
}: TabletLayoutProps) {
  const { isPortrait, deviceType, windowSize } = useResponsive();
  
  // 平板端布局参数
  const containerMaxWidth = isPortrait 
    ? (deviceType === 'tablet' ? '768px' : '834px')  // 竖屏：iPad Mini / iPad Pro 11"
    : '100%';  // 横屏：全宽
  
  const contentPadding = isPortrait ? 'px-8' : 'px-12';
  const topBarPadding = isPortrait ? 'px-8' : 'px-12';
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] overflow-hidden">
      {/* Ambient Background Effects - 平板端更大的光效 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Tablet Container - 响应式自适应 */}
      <div 
        className="w-full h-full mx-auto bg-gradient-to-b from-[#0a0e27]/85 via-[#1a1f3a]/75 to-[#0f1428]/85 flex flex-col relative shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl border-x border-white/5"
        style={{
          maxWidth: containerMaxWidth,
        }}
      >
        {/* Top Bar - 浮动固定在顶部，带毛玻璃效果 */}
        <div className={`absolute top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-gradient-to-b from-[#0a0e27]/80 via-[#0a0e27]/60 to-transparent border-b border-white/5 ${topBarPadding}`}>
          <MobileTopBar 
            onMenuClick={onMenuClick} 
            onVideoCallClick={onVideoCallClick}
            onModelClick={onModelClick}
            selectedModel={selectedModel}
            showIslandIcon={showIslandIcon}
            onIslandIconClick={onIslandIconClick}
          />
        </div>
        
        {/* Content Area - 全屏滚动，上下可穿透 */}
        <div className={`flex-1 overflow-y-auto pt-16 pb-24 ${contentPadding}`}>
          {children}
        </div>

        {/* Floating Action Buttons - Tablet (智能扩展输入系统) */}
        <FloatingActionButtons
          onSendMessage={onSendMessage}
          onTriggerIslandVoice={onVoiceClick}
          onNewChat={onStartChat}
          onShowNotification={onShowNotification}
          isRecording={isRecording}
        />
      </div>
    </div>
  );
}

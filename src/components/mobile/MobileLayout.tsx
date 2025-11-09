import { ReactNode } from 'react';
import { MobileTopBar } from '../MobileTopBar';
import { FloatingActionButtons } from '../FloatingActionButtons';
import { useResponsive } from '../../hooks/useResponsive';

interface MobileLayoutProps {
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

export function MobileLayout({
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
}: MobileLayoutProps) {
  const { deviceType, windowSize, isPortrait } = useResponsive();
  
  // 根据设备类型动态计算容器最大宽度和高度
  const getContainerMaxWidth = () => {
    switch (deviceType) {
      case 'mobile-small':
        return '375px';   // iPhone SE, small phones
      case 'mobile':
        return '390px';   // iPhone 12/13/14
      case 'mobile-large':
        return '430px';   // iPhone 14 Pro Max
      case 'tablet':
        return isPortrait ? '768px' : '1024px';  // iPad Mini
      case 'tablet-large':
        return isPortrait ? '834px' : '1194px';  // iPad Pro 11"
      default:
        return '430px';
    }
  };
  
  const getContainerMaxHeight = () => {
    // 对于横屏平板，限制高度
    if (!isPortrait && (deviceType === 'tablet' || deviceType === 'tablet-large')) {
      return '100vh';
    }
    // 移动端和竖屏平板，使用实际视口高度
    return '100vh';
  };
  
  const containerMaxWidth = getContainerMaxWidth();
  const containerMaxHeight = getContainerMaxHeight();
  
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Mobile/Tablet Container - 响应式自适应 */}
      <div 
        className="w-full h-full mx-auto bg-gradient-to-b from-[#0a0e27]/85 via-[#1a1f3a]/75 to-[#0f1428]/85 flex flex-col relative shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-xl border-x border-white/5"
        style={{
          maxWidth: containerMaxWidth,
          maxHeight: containerMaxHeight,
        }}
      >
        {/* Top Bar - 浮动固定在顶部，带毛玻璃效果 */}
        <div className="absolute top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-gradient-to-b from-[#0a0e27]/80 via-[#0a0e27]/60 to-transparent border-b border-white/5">
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
        <div className="flex-1 overflow-y-auto pt-16 pb-20">
          {children}
        </div>

        {/* Floating Action Buttons - Mobile (智能扩展输入系统) - 已经是浮动的 */}
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

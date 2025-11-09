/**
 * 骨架屏组件集合
 * 提供统一的加载状态视觉反馈
 */

import { Skeleton } from '../ui/skeleton';
import { useResponsive } from '../../hooks/useResponsive';

// ========================================
// 卡片网格骨架屏
// ========================================

export function AIFeatureCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/5 border border-white/10 p-5">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-12 h-12 rounded-2xl bg-white/10" />
        <Skeleton className="w-16 h-6 rounded-full bg-white/10" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />
      <Skeleton className="h-4 w-1/2 bg-white/10" />
    </div>
  );
}

export function CardGridSkeleton() {
  const { isMobileSmall, isTablet } = useResponsive();
  
  const count = isTablet ? 9 : 6;
  const gridCols = isTablet ? 'grid-cols-3' : 'grid-cols-2';
  const gap = isMobileSmall ? 'gap-2' : 'gap-3';
  const padding = isMobileSmall ? 'px-4' : isTablet ? 'px-8' : 'px-6';
  
  return (
    <div className={`grid ${gridCols} ${gap} ${padding} pt-4 pb-4`}>
      {[...Array(count)].map((_, i) => (
        <AIFeatureCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ========================================
// 聊天消息骨架屏
// ========================================

export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      {!isUser && <Skeleton className="w-8 h-8 rounded-full bg-white/10 shrink-0" />}
      
      {/* Message Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <Skeleton className={`h-20 ${isUser ? 'w-64' : 'w-80'} rounded-3xl bg-white/10`} />
        <Skeleton className="h-3 w-24 bg-white/10" />
      </div>
    </div>
  );
}

export function ChatListSkeleton() {
  return (
    <div className="flex flex-col p-6 space-y-4">
      <ChatMessageSkeleton isUser={false} />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton isUser={false} />
      <ChatMessageSkeleton isUser={true} />
    </div>
  );
}

// ========================================
// 顶部栏骨架屏
// ========================================

export function TopBarSkeleton() {
  return (
    <div className="h-16 px-6 flex items-center justify-between backdrop-blur-2xl bg-white/5 border-b border-white/10">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-xl bg-white/10" />
        <Skeleton className="h-6 w-32 bg-white/10" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="w-24 h-9 rounded-full bg-white/10" />
        <Skeleton className="w-10 h-10 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

// ========================================
// 侧边栏骨架屏
// ========================================

export function SidebarItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl">
      <Skeleton className="w-10 h-10 rounded-xl bg-white/10" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2 bg-white/10" />
        <Skeleton className="h-3 w-24 bg-white/10" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 h-full backdrop-blur-2xl bg-white/5 border-r border-white/10 p-4">
      <Skeleton className="h-10 w-full mb-6 rounded-xl bg-white/10" />
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <SidebarItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ========================================
// Artifact 模态框骨架屏
// ========================================

export function ArtifactModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1428] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl bg-white/10" />
            <div>
              <Skeleton className="h-6 w-48 mb-2 bg-white/10" />
              <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
          </div>
          <Skeleton className="w-10 h-10 rounded-xl bg-white/10" />
        </div>
        
        {/* Content */}
        <div className="p-6">
          <Skeleton className="h-96 w-full rounded-2xl bg-white/10" />
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <Skeleton className="w-24 h-10 rounded-xl bg-white/10" />
          <Skeleton className="w-24 h-10 rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}

// ========================================
// 模型选择器骨架屏
// ========================================

export function ModelCardSkeleton() {
  return (
    <div className="p-4 rounded-2xl backdrop-blur-2xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-xl bg-white/10" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2 bg-white/10" />
          <Skeleton className="h-3 w-24 bg-white/10" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-xl bg-white/10" />
    </div>
  );
}

export function ModelSelectorSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1428] rounded-3xl w-full max-w-2xl p-6">
        <Skeleton className="h-8 w-48 mb-6 bg-white/10" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <ModelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================================
// 完整布局骨架屏
// ========================================

export function DesktopLayoutSkeleton() {
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1428]">
      <SidebarSkeleton />
      <div className="flex-1 flex flex-col">
        <TopBarSkeleton />
        <div className="flex-1 p-6">
          <CardGridSkeleton />
        </div>
      </div>
    </div>
  );
}

export function MobileLayoutSkeleton() {
  const { deviceType } = useResponsive();
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1428]">
      <TopBarSkeleton />
      <div className="flex-1 overflow-y-auto">
        <CardGridSkeleton />
      </div>
    </div>
  );
}

// ========================================
// 天气卡片骨架屏
// ========================================

export function WeatherCardSkeleton() {
  return (
    <div className="p-6 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Skeleton className="h-8 w-32 mb-2 bg-white/10" />
          <Skeleton className="h-4 w-24 bg-white/10" />
        </div>
        <Skeleton className="w-16 h-16 rounded-full bg-white/10" />
      </div>
      <div className="flex gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton className="h-4 w-full mb-2 bg-white/10" />
            <Skeleton className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 脉动加载指示器
// ========================================

export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} rounded-full bg-blue-500/50`}
          style={{
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

// ========================================
// 旋转加载指示器
// ========================================

export function SpinnerLoader({ size = 'md', color = 'blue' }: { size?: 'sm' | 'md' | 'lg'; color?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-${color}-500/20 border-t-${color}-500 animate-spin`}
      />
    </div>
  );
}

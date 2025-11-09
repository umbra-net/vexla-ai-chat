/**
 * 懒加载组件封装
 * 提供统一的懒加载和 Suspense 边界
 */

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { Skeleton } from './ui/skeleton';

// 懒加载包装器配置
interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// 默认加载占位符
function DefaultFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1428]">
      <div className="flex flex-col items-center gap-4">
        {/* 加载动画 - 脉动圆环 */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
        
        {/* 加载文本 */}
        <div className="text-white/60 animate-pulse">Loading...</div>
      </div>
    </div>
  );
}

// 通用懒加载包装器
export function LazyWrapper({ children, fallback = <DefaultFallback /> }: LazyWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

// ========================================
// 布局组件懒加载
// ========================================

export const LazyDesktopLayout = lazy(() => 
  import('./desktop/DesktopLayout').then(module => ({ 
    default: module.DesktopLayout 
  }))
);

export const LazyTabletLayout = lazy(() => 
  import('./tablet/TabletLayout').then(module => ({ 
    default: module.TabletLayout 
  }))
);

export const LazyMobileLayout = lazy(() => 
  import('./mobile/MobileLayout').then(module => ({ 
    default: module.MobileLayout 
  }))
);

// ========================================
// 视图组件懒加载
// ========================================

export const LazyDesktopHome = lazy(() => 
  import('./desktop/DesktopHome').then(module => ({ 
    default: module.DesktopHome 
  }))
);

export const LazyDesktopChat = lazy(() => 
  import('./desktop/DesktopChat').then(module => ({ 
    default: module.DesktopChat 
  }))
);

export const LazyMobileHome = lazy(() => 
  import('./mobile/MobileHome').then(module => ({ 
    default: module.MobileHome 
  }))
);

export const LazyMobileChat = lazy(() => 
  import('./mobile/MobileChat').then(module => ({ 
    default: module.MobileChat 
  }))
);

// ========================================
// 模态框组件懒加载（按需加载）
// ========================================

export const LazyEnhancedArtifactModal = lazy(() => 
  import('./EnhancedArtifactModal').then(module => ({ 
    default: module.EnhancedArtifactModal 
  }))
);

export const LazySettingsModal = lazy(() => 
  import('./SettingsModal').then(module => ({ 
    default: module.SettingsModal 
  }))
);

export const LazyModelSelectorModal = lazy(() => 
  import('./ModelSelectorModal').then(module => ({ 
    default: module.ModelSelectorModal 
  }))
);

export const LazyBrowserModal = lazy(() => 
  import('./BrowserModal').then(module => ({ 
    default: module.BrowserModal 
  }))
);

// LazySiriWaveAnimation 已移除 - 语音功能已统一到 EnhancedDynamicIsland
// export const LazySiriWaveAnimation = lazy(() => 
//   import('./SiriWaveAnimation').then(module => ({ 
//     default: module.SiriWaveAnimation 
//   }))
// );

// ========================================
// 侧边栏组件懒加载
// ========================================

export const LazySidebarPanel = lazy(() => 
  import('./SidebarPanel').then(module => ({ 
    default: module.SidebarPanel 
  }))
);

// ========================================
// 特定功能组件懒加载
// ========================================

export const LazyWeatherCard = lazy(() => 
  import('./WeatherCard')
);

// ========================================
// 骨架屏占位符（用于更好的加载体验）
// ========================================

export function LayoutSkeleton() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#0a0e27] via-[#1a1f3a] to-[#0f1428] animate-pulse">
      <div className="h-16 bg-white/5 border-b border-white/10"></div>
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="w-64 bg-white/5 border-r border-white/10"></div>
        <div className="flex-1 p-6">
          <Skeleton className="h-12 w-64 mb-6 bg-white/10" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#1a1f3a] to-[#0f1428] rounded-3xl p-6 w-full max-w-2xl animate-pulse">
        <Skeleton className="h-8 w-48 mb-4 bg-white/10" />
        <Skeleton className="h-64 w-full bg-white/10" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <Skeleton className={`h-20 ${i % 2 === 0 ? 'w-3/4' : 'w-2/3'} bg-white/10`} />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 p-6">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-32 bg-white/10 rounded-2xl" />
      ))}
    </div>
  );
}

// Aliases for backward compatibility
export const DesktopLayoutSkeleton = LayoutSkeleton;
export const MobileLayoutSkeleton = LayoutSkeleton;

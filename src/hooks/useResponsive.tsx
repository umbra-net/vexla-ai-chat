import { useState, useEffect } from 'react';

// 更细致的设备类型定义
export type DeviceType = 'mobile-small' | 'mobile' | 'mobile-large' | 'tablet' | 'tablet-large' | 'desktop' | 'desktop-large';
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

// 响应式断点配置（基于常见设备尺寸 + 优化中等屏幕）
export const BREAKPOINTS = {
  // 移动端（真正的手机）
  'mobile-small': 0,      // iPhone SE, small phones (320px+)
  'mobile': 375,          // iPhone 12/13/14, standard phones (375px+)
  'mobile-large': 430,    // iPhone 14 Pro Max, large phones (430px+)
  
  // 平板端（小屏桌面和平板）
  'tablet': 640,          // ✅ 优化：降低到 640px（Tailwind md），适配 W752 等中等屏幕
  'tablet-large': 1024,   // iPad Air/Pro 11", Samsung Galaxy Tab (1024px+)
  
  // 桌面端
  'desktop': 1280,        // Standard desktop (1280px+)
  'desktop-large': 1920,  // Large desktop/4K (1920px+)
} as const;

// 设备识别函数
function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS['mobile']) return 'mobile-small';
  if (width < BREAKPOINTS['mobile-large']) return 'mobile';
  if (width < BREAKPOINTS['tablet']) return 'mobile-large';
  if (width < BREAKPOINTS['tablet-large']) return 'tablet';
  if (width < BREAKPOINTS['desktop']) return 'tablet-large';
  if (width < BREAKPOINTS['desktop-large']) return 'desktop';
  return 'desktop-large';
}

// 设备分类函数
function getDeviceCategory(deviceType: DeviceType): DeviceCategory {
  if (deviceType.startsWith('mobile')) return 'mobile';
  if (deviceType.startsWith('tablet')) return 'tablet';
  return 'desktop';
}

export function useResponsive() {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window !== 'undefined') {
      return getDeviceType(window.innerWidth);
    }
    return 'desktop';
  });

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      setDeviceType(getDeviceType(width));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const deviceCategory = getDeviceCategory(deviceType);

  return {
    // 设备类型
    deviceType,
    deviceCategory,
    
    // 简化的布尔值
    isMobile: deviceCategory === 'mobile',
    isTablet: deviceCategory === 'tablet',
    isDesktop: deviceCategory === 'desktop',
    
    // 详细设备检测
    isMobileSmall: deviceType === 'mobile-small',
    isMobileStandard: deviceType === 'mobile',
    isMobileLarge: deviceType === 'mobile-large',
    isTabletSmall: deviceType === 'tablet',
    isTabletLarge: deviceType === 'tablet-large',
    isDesktopStandard: deviceType === 'desktop',
    isDesktopLarge: deviceType === 'desktop-large',
    
    // 窗口尺寸
    windowSize,
    
    // 方向检测
    isPortrait: windowSize.height > windowSize.width,
    isLandscape: windowSize.width > windowSize.height,
    
    // 断点辅助函数
    isAtLeast: (breakpoint: keyof typeof BREAKPOINTS) => 
      windowSize.width >= BREAKPOINTS[breakpoint],
    isBelow: (breakpoint: keyof typeof BREAKPOINTS) => 
      windowSize.width < BREAKPOINTS[breakpoint],
  };
}

/**
 * 响应式设计系统配置
 * 支持所有主流设备尺寸
 */

// 设备信息数据库
export const DEVICE_DATABASE = {
  // 移动端 - 小屏
  'mobile-small': {
    name: 'Small Phones',
    examples: ['iPhone SE', 'iPhone 5/5S', 'Small Android'],
    minWidth: 320,
    maxWidth: 374,
    containerMaxWidth: '375px',
    gridCols: 2,
    padding: 'px-4',
    gap: 'gap-2',
  },
  
  // 移动端 - 标准
  'mobile': {
    name: 'Standard Phones',
    examples: ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone XR'],
    minWidth: 375,
    maxWidth: 429,
    containerMaxWidth: '390px',
    gridCols: 2,
    padding: 'px-6',
    gap: 'gap-3',
  },
  
  // 移动端 - 大屏
  'mobile-large': {
    name: 'Large Phones',
    examples: ['iPhone 14 Pro Max', 'iPhone 15 Pro Max', 'Samsung S23 Ultra'],
    minWidth: 430,
    maxWidth: 767,
    containerMaxWidth: '430px',
    gridCols: 2,
    padding: 'px-6',
    gap: 'gap-3',
  },
  
  // 平板端 - 小
  'tablet': {
    name: 'Small Tablets',
    examples: ['iPad Mini', '7-8" Tablets'],
    minWidth: 768,
    maxWidth: 1023,
    containerMaxWidth: {
      portrait: '768px',
      landscape: '100%',
    },
    gridCols: {
      portrait: 2,
      landscape: 3,
    },
    padding: {
      portrait: 'px-8',
      landscape: 'px-12',
    },
    gap: 'gap-4',
  },
  
  // 平板端 - 大
  'tablet-large': {
    name: 'Large Tablets',
    examples: ['iPad Air', 'iPad Pro 11"', 'Samsung Galaxy Tab S8'],
    minWidth: 1024,
    maxWidth: 1279,
    containerMaxWidth: {
      portrait: '834px',
      landscape: '100%',
    },
    gridCols: {
      portrait: 2,
      landscape: 3,
    },
    padding: {
      portrait: 'px-8',
      landscape: 'px-16',
    },
    gap: 'gap-4',
  },
  
  // 桌面端 - 标准
  'desktop': {
    name: 'Standard Desktop',
    examples: ['13-15" Laptops', '1280x720-1920x1080 Monitors'],
    minWidth: 1280,
    maxWidth: 1919,
    sidebarWidth: 280,
    rightPanelWidth: 480,
    contentMaxWidth: '1400px',
  },
  
  // 桌面端 - 大屏
  'desktop-large': {
    name: 'Large Desktop',
    examples: ['27"+ Monitors', '4K Displays', 'Ultrawide'],
    minWidth: 1920,
    maxWidth: Infinity,
    sidebarWidth: 320,
    rightPanelWidth: 600,
    contentMaxWidth: '1800px',
  },
} as const;

// 折叠设备特殊支持
export const FOLDABLE_DEVICES = {
  // 三星 Galaxy Z Fold
  'samsung-fold': {
    folded: {
      width: 884,  // 折叠时内屏宽度
      height: 2208,
      deviceType: 'tablet',
    },
    unfolded: {
      width: 1768,  // 展开时宽度
      height: 2208,
      deviceType: 'tablet-large',
    },
  },
  
  // 其他折叠设备可以添加到这里
} as const;

// 响应式断点（Tailwind 风格）
export const RESPONSIVE_BREAKPOINTS = {
  sm: '640px',    // 小屏
  md: '768px',    // 平板
  lg: '1024px',   // 大平板/小桌面
  xl: '1280px',   // 标准桌面
  '2xl': '1920px', // 大桌面
} as const;

// FloatingActionButtons 响应式配置
export const FAB_RESPONSIVE_CONFIG = {
  'mobile-small': {
    baseWidth: 280,
    maxWidth: 'calc(100vw - 32px)',
    buttonSize: 'h-11 w-11',
    fontSize: 'text-sm',
  },
  'mobile': {
    baseWidth: 320,
    maxWidth: 'calc(100vw - 32px)',
    buttonSize: 'h-12 w-12',
    fontSize: 'text-base',
  },
  'mobile-large': {
    baseWidth: 360,
    maxWidth: 'calc(100vw - 32px)',
    buttonSize: 'h-12 w-12',
    fontSize: 'text-base',
  },
  'tablet': {
    baseWidth: 480,
    maxWidth: '680px',
    buttonSize: 'h-14 w-14',
    fontSize: 'text-base',
  },
  'tablet-large': {
    baseWidth: 520,
    maxWidth: '720px',
    buttonSize: 'h-14 w-14',
    fontSize: 'text-base',
  },
  'desktop': {
    baseWidth: 560,
    maxWidth: '840px',
    buttonSize: 'h-14 w-14',
    fontSize: 'text-base',
  },
  'desktop-large': {
    baseWidth: 600,
    maxWidth: '960px',
    buttonSize: 'h-16 w-16',
    fontSize: 'text-lg',
  },
} as const;

// 动画配置 - 根据设备调整
export const RESPONSIVE_ANIMATION_CONFIG = {
  mobile: {
    duration: 0.2,  // 移动端动画更快
    stagger: 0.03,
    spring: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  tablet: {
    duration: 0.25,
    stagger: 0.04,
    spring: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
    },
  },
  desktop: {
    duration: 0.3,  // 桌面端动画更流畅
    stagger: 0.05,
    spring: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
} as const;

// 导出辅助函数
export function getDeviceConfig(deviceType: keyof typeof DEVICE_DATABASE) {
  return DEVICE_DATABASE[deviceType];
}

export function getFABConfig(deviceType: keyof typeof FAB_RESPONSIVE_CONFIG) {
  return FAB_RESPONSIVE_CONFIG[deviceType];
}

/**
 * ==========================================
 * VEXLA UMBRIC - UI 配置常量
 * ==========================================
 * 
 * 所有UI相关的配置和常量
 * 移除硬编码，统一管理
 */

// ==========================================
// 时间和延迟配置
// ==========================================

export const TIMING = {
  // 动画时长
  ANIMATION: {
    TYPING_DELAY: 1500,
    MESSAGE_FADE_IN: 300,
    MODAL_TRANSITION: 300,
    ISLAND_EXPANSION: 600,
    ISLAND_COLLAPSE: 400,
    NOTIFICATION_DISPLAY: 3000,
  },
  
  // 自动操作延迟
  AUTO: {
    DISMISS_DELAY: 2000,
    COMPACT_DELAY: 5000,
    AWAKENING_DURATION: 1000,
    FEATURE_CLICK_DELAY: 500,
  },
  
  // 语音相关
  VOICE: {
    MAX_RECORDING_TIME: 30000, // 30秒
    AUTO_STOP: true,
  },
} as const;

// ==========================================
// 消息和通知文本
// ==========================================

export const MESSAGES = {
  // 灵动岛通知
  ISLAND: {
    MODEL_SELECT: 'Select your AI model...',
    SETTINGS_OPEN: 'Opening settings...',
    BROWSER_OPENING: 'Opening browser...',
    BROWSER_OPENED: 'Browser opened!',
    BROWSER_CLOSED: 'Browser closed',
    VIDEO_CALL: 'Video call feature coming soon!',
    PROCESSING: 'Processing your request...',
    AWAKENING: 'Awakening...',
    LISTENING: 'Listening...',
  },
  
  // 欢迎消息
  WELCOME: {
    DESKTOP: 'Welcome to Vexla Umbric! Click to start chatting.',
    MOBILE: 'What would you like to build today?',
    DEFAULT: 'Ask me anything...',
  },
  
  // 功能开启消息
  FEATURE: {
    OPENING: (name: string) => `Opening ${name}...`,
  },
  
  // AI响应
  WEATHER: "Here's the current weather information for you:",
  BROWSER: "I've opened the browser for you. You can now browse YouTube.",
  
  // Artifact响应
  ARTIFACTS: {
    CODE: "I've created a React counter component for you. Check out the artifact below:",
    TODO: "Here's a complete Todo List application with HTML, CSS, and JavaScript:",
    POEM: "I've written a poem for you. Here it is:",
  },
} as const;

// ==========================================
// 灵动岛配置
// ==========================================

export const ISLAND_CONFIG = {
  // 尺寸配置（像素）
  SIZE: {
    COMPACT: { width: 40, height: 40 },
    IDLE: { width: 120, height: 40 },
    INPUT: { width: 360, height: 80, max: 480 },
    VOICE_MOBILE: { width: 'min(90vw, 380px)', height: 100 },
    VOICE_TABLET: { width: 420, height: 120 },
    VOICE_DESKTOP: { width: 480, height: 140 },
    PROCESSING: { width: 200, height: 60, max: 240 },
  },
  
  // 自动行为
  BEHAVIOR: {
    AUTO_COMPACT: true,
    AUTO_COMPACT_DELAY: 5000,
    CLICK_TO_EXPAND: true,
  },
  
  // 按钮显示
  BUTTONS: {
    SHOW_VOICE: true,
    SHOW_SEND: true,
    SHOW_CLOSE: true,
    SHOW_ATTACH: true,
  },
} as const;

// ==========================================
// 响应式断点
// ==========================================

export const BREAKPOINTS = {
  MOBILE_SMALL: 375,
  MOBILE: 390,
  MOBILE_LARGE: 430,
  TABLET: 640,
  TABLET_LARGE: 1024,
  DESKTOP: 1280,
} as const;

// ==========================================
// Z-Index 层级
// ==========================================

export const Z_INDEX = {
  BASE: 0,
  CONTENT: 10,
  HEADER: 40,
  MODAL_BACKDROP: 50,
  MODAL: 60,
  ISLAND: 70,
  TOAST: 80,
  TOOLTIP: 90,
} as const;

// ==========================================
// 快捷操作
// ==========================================

export const QUICK_ACTIONS = [
  { icon: 'Search', label: 'Search', prompt: 'Search for ' },
  { icon: 'Code', label: 'Code', prompt: 'Generate code for ' },
  { icon: 'ImageIcon', label: 'Image', prompt: 'Generate an image of ' },
  { icon: 'Languages', label: 'Translate', prompt: 'Translate ' },
  { icon: 'FileText', label: 'Summarize', prompt: 'Summarize ' },
  { icon: 'Globe', label: 'Browse', prompt: 'Browse ' },
  { icon: 'Sparkles', label: 'Create', prompt: 'Create ' },
] as const;

// ==========================================
// 键盘快捷键
// ==========================================

export const KEYBOARD_SHORTCUTS = {
  SEND_MESSAGE: 'Enter',
  NEW_CHAT: 'Ctrl+N',
  OPEN_SETTINGS: 'Ctrl+,',
  TOGGLE_SIDEBAR: 'Ctrl+B',
  FOCUS_INPUT: '/',
  ESCAPE: 'Escape',
} as const;

// ==========================================
// 玻璃拟态样式
// ==========================================

export const GLASS_STYLES = {
  // 背景
  BACKGROUND: {
    LIGHT: 'bg-white/[0.08]',
    MEDIUM: 'bg-white/[0.12]',
    HEAVY: 'bg-white/[0.15]',
  },
  
  // 边框
  BORDER: {
    LIGHT: 'border-white/[0.08]',
    MEDIUM: 'border-white/[0.12]',
    HEAVY: 'border-white/[0.20]',
  },
  
  // 模糊
  BLUR: {
    LIGHT: 'backdrop-blur-[20px]',
    MEDIUM: 'backdrop-blur-[40px]',
    HEAVY: 'backdrop-blur-[60px]',
  },
  
  // 饱和度
  SATURATE: 'saturate-[150%]',
  
  // 阴影
  SHADOW: {
    SMALL: 'shadow-[0_8px_24px_rgba(0,0,0,0.15)]',
    MEDIUM: 'shadow-[0_16px_48px_rgba(0,0,0,0.4)]',
    LARGE: 'shadow-[0_24px_64px_rgba(0,0,0,0.5)]',
  },
} as const;

// ==========================================
// 文字颜色
// ==========================================

export const TEXT_COLORS = {
  PRIMARY: 'text-white/90',
  SECONDARY: 'text-white/70',
  TERTIARY: 'text-white/60',
  PLACEHOLDER: 'text-white/40',
  DISABLED: 'text-white/30',
} as const;

// ==========================================
// 渐变色
// ==========================================

export const GRADIENTS = {
  // 背景渐变
  BACKGROUND: {
    PRIMARY: 'from-[#0a0e27] via-[#1a1f3a] to-[#0f1428]',
    TOPBAR: 'from-[#0a0e27]/80 via-[#0a0e27]/60 to-transparent',
  },
  
  // 按钮渐变
  BUTTON: {
    BLUE: 'from-blue-500 to-purple-600',
    PURPLE: 'from-purple-500 to-pink-500',
    GREEN: 'from-emerald-500 to-teal-500',
    RED: 'from-red-500 to-pink-500',
  },
  
  // 光晕渐变
  GLOW: {
    BLUE: 'from-blue-500/40 via-purple-500/40 to-pink-500/40',
    RAINBOW: 'from-blue-500/25 via-purple-500/20 to-pink-500/15',
  },
} as const;

// ==========================================
// 动画重复次数
// ==========================================

export const ANIMATION_REPEAT = {
  INFINITE_SAFE: 10000, // 避免真正的Infinity造成内存问题
  PULSE: 10000,
  ROTATE: 10000,
  GLOW: 10000,
} as const;

// ==========================================
// 触发关键词
// ==========================================

export const TRIGGER_KEYWORDS = {
  WEATHER: ['weather', 'temperature', 'forecast'],
  BROWSER: ['open', 'youtube', 'website', 'browser'],
  IMAGE: ['image', 'picture', 'photo'],
  CODE: ['code', 'component', 'react'],
  TODO: ['todo', 'task'],
  POEM: ['poem', 'poetry'],
} as const;

// ==========================================
// 浏览器URL
// ==========================================

export const DEFAULT_URLS = {
  YOUTUBE: 'https://youtube.com',
  GOOGLE: 'https://google.com',
} as const;

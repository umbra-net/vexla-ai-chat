import { motion, AnimatePresence } from 'motion/react';
import { Bot, Check, Loader2, Sparkles, Globe, Zap, Code, Image as ImageIcon, MessageSquare, X, Mic, Send, Paperclip, Search, Languages, FileText, Clock, Smile, Camera, Music, Phone, PhoneOff, PhoneMissed, Play, Pause, SkipBack, SkipForward, Volume2, User, Calendar, Cloud } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { VoiceWaveform, VoiceAnimationMode } from './VoiceWaveform';
import { MODEL_DISPLAY_NAMES } from '../constants';

export type IslandMessageType = 
  | 'welcome' 
  | 'loading' 
  | 'success' 
  | 'info' 
  | 'browser' 
  | 'code' 
  | 'image' 
  | 'chat'
  | 'error';

export type IslandMode = 
  | 'idle'         // 空闲状态 - 显示欢迎消息，可点击展开
  | 'compact'      // 紧凑模式 - 仅显示图标
  | 'input'        // 输入模式 - 显示输入框
  | 'voice'        // 语音模式 - 显示录音动画
  | 'awakening'    // 唤醒模式 - 语音启动动画 (1秒)
  | 'listening'    // 收听模式 - 语音收听动画
  | 'processing'   // 处理中 - 显示加载动画
  | 'notification' // 通知模式 - 显示通知消息
  | 'model-selector' // 模型选择模式 - 显示当前模型并可展开选择
  | 'agent-call'   // 来电模式 - 显示Agent来电界面
  | 'media-player' // 媒体播放器模式 - 显示播放控制
  | 'app-content'; // 应用内容模式 - 显示应用内容

interface EnhancedDynamicIslandProps {
  // 输入功能
  onSendMessage?: (message: string) => void;
  onVoiceInput?: () => void;
  isRecording?: boolean;
  
  // 状态显示 (通知模式)
  isVisible?: boolean;
  message?: string;
  type?: IslandMessageType;
  onHide?: () => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
  
  // 模式控制
  mode?: IslandMode;
  onModeChange?: (mode: IslandMode) => void;
  
  // 可选配置
  placeholder?: string;
  showVoiceButton?: boolean;
  showSendButton?: boolean;
  alwaysExpanded?: boolean;
  
  // 新增：自动收起配置
  autoCompact?: boolean;
  autoCompactDelay?: number;
  
  // 模型选择模式
  selectedModel?: string;
  onModelSelect?: (model: string) => void;
  
  // Agent Call 模式
  agentName?: string;
  agentAvatar?: string;
  onAcceptCall?: () => void;
  onRejectCall?: () => void;
  onHoldCall?: () => void;
  callDuration?: number;
  
  // Media Player 模式
  mediaTitle?: string;
  mediaArtist?: string;
  mediaCover?: string;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
  currentTime?: number;
  duration?: number;
  
  // App Content 模式
  contentType?: 'weather' | 'calendar' | 'notification' | 'custom';
  contentData?: any;
}

export function EnhancedDynamicIsland({ 
  // 输入功能
  onSendMessage,
  onVoiceInput,
  isRecording = false,
  
  // 状态显示
  isVisible = true,
  message = 'Hi, how can I help?',
  type = 'welcome',
  onHide,
  autoDismiss = true,
  dismissDelay = 3000,
  
  // 模式控制
  mode: externalMode,
  onModeChange,
  
  // 可选配置
  placeholder = 'Ask me anything...',
  showVoiceButton = true,
  showSendButton = true,
  alwaysExpanded = false,
  
  // 自动收起配置
  autoCompact = true,
  autoCompactDelay = 5000,
  
  // 模型选择
  selectedModel = 'vexla-ultra',
  onModelSelect,
  
  // Agent Call
  agentName = 'AI Assistant',
  agentAvatar,
  onAcceptCall,
  onRejectCall,
  onHoldCall,
  callDuration = 0,
  
  // Media Player
  mediaTitle = 'Unknown Track',
  mediaArtist = 'Unknown Artist',
  mediaCover,
  isPlaying = false,
  onPlayPause,
  onSkipBack,
  onSkipForward,
  currentTime = 0,
  duration = 0,
  
  // App Content
  contentType = 'notification',
  contentData,
}: EnhancedDynamicIslandProps) {
  const [internalMode, setInternalMode] = useState<IslandMode>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showModelSelector, setShowModelSelector] = useState(false);

  // 使用外部模式或内部模式
  const currentMode = externalMode || internalMode;

  // 自动收起到 compact 模式
  useEffect(() => {
    if (!autoCompact || currentMode !== 'idle' || !isVisible) return;
    
    const timer = setTimeout(() => {
      if (externalMode) {
        onModeChange?.('compact');
      } else {
        setInternalMode('compact');
      }
      setIsExpanded(false);
    }, autoCompactDelay);
    
    return () => clearTimeout(timer);
  }, [currentMode, autoCompact, autoCompactDelay, isVisible, externalMode, onModeChange]);

  useEffect(() => {
    if (!isVisible) {
      setIsExpanded(false);
      setInputValue('');
      if (!externalMode) {
        setInternalMode('idle');
      }
      return;
    }

    // 根据模式自动展开
    if (currentMode === 'input' || currentMode === 'voice' || currentMode === 'awakening' || currentMode === 'listening' || currentMode === 'processing') {
      setIsExpanded(true);
    } else if (currentMode === 'notification') {
      // 通知模式：先收起，再展开
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 300);

      // Auto-dismiss if enabled
      if (autoDismiss && onHide) {
        const dismissTimer = setTimeout(() => {
          setIsExpanded(false);
          setTimeout(() => {
            onHide();
          }, 300);
        }, dismissDelay);
        
        return () => {
          clearTimeout(expandTimer);
          clearTimeout(dismissTimer);
        };
      }

      return () => clearTimeout(expandTimer);
    } else if (currentMode === 'idle') {
      // 空闲模式：展开显示欢迎消息
      const expandTimer = setTimeout(() => {
        setIsExpanded(true);
      }, 300);
      return () => clearTimeout(expandTimer);
    } else if (currentMode === 'compact') {
      // 紧凑模式：收起
      setIsExpanded(false);
    }
  }, [isVisible, currentMode, autoDismiss, dismissDelay, onHide, externalMode]);

  const getIcon = useCallback(() => {
    switch (type) {
      case 'welcome':
        return <Sparkles className="w-4 h-4 text-blue-300" />;
      case 'loading':
        return <Loader2 className="w-4 h-4 text-white animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'browser':
        return <Globe className="w-4 h-4 text-purple-400" />;
      case 'code':
        return <Code className="w-4 h-4 text-yellow-400" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-pink-400" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'error':
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return <Bot className="w-4 h-4 text-blue-400" />;
    }
  }, [type]);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setInputValue('');
    
    // 关闭后回到 idle 状态
    if (externalMode) {
      onModeChange?.('idle');
    } else {
      setInternalMode('idle');
    }
    
    // 不调用 onHide，保持灵动岛可见
  }, [externalMode, onModeChange]);

  const handleClick = useCallback(() => {
    // 点击灵动岛的行为根据模式不同而不同
    if (currentMode === 'model-selector') {
      // 模型选择模式：点击展开模型列表
      setShowModelSelector(!showModelSelector);
      setIsExpanded(!isExpanded);
    } else if ((currentMode === 'idle' || currentMode === 'compact') && onSendMessage) {
      // idle 或 compact 模式：展开为输入模式
      if (!externalMode) {
        setInternalMode('input');
      } else {
        onModeChange?.('input');
      }
      setIsExpanded(true);
    }
  }, [currentMode, onSendMessage, externalMode, onModeChange, showModelSelector, isExpanded]);

  const handleSend = useCallback(() => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      handleClose();
    }
  }, [inputValue, onSendMessage, handleClose]);

  const handleVoiceToggle = useCallback(() => {
    if (onVoiceInput) {
      onVoiceInput();
      if (!externalMode) {
        setInternalMode(isRecording ? 'input' : 'voice');
      }
    }
  }, [onVoiceInput, isRecording, externalMode]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // 根据模式决定尺寸 - 增强所有模式
  const getSize = () => {
    // 响应式尺寸
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
    
    if (currentMode === 'compact') {
      // 紧凑模式 - 仅图标
      return { width: 40, height: 40, minWidth: 40, maxWidth: 40 };
    } else if (currentMode === 'input') {
      return { width: 360, height: 80, minWidth: 360, maxWidth: 480 };
    } else if (currentMode === 'awakening' || currentMode === 'listening') {
      // 语音模式 - 响应式尺寸
      if (isMobile) {
        return { width: 'min(90vw, 380px)', height: 100, minWidth: 320, maxWidth: 380 };
      } else if (isTablet) {
        return { width: 420, height: 120, minWidth: 420, maxWidth: 420 };
      } else {
        return { width: 480, height: 140, minWidth: 480, maxWidth: 480 };
      }
    } else if (currentMode === 'voice') {
      // 兼容旧的 voice 模式
      return { width: 280, height: 60, minWidth: 280, maxWidth: 320 };
    } else if (currentMode === 'processing') {
      return { width: 200, height: 60, minWidth: 200, maxWidth: 240 };
    } else if (currentMode === 'model-selector') {
      // 模型选择模式
      if (showModelSelector) {
        return { width: 320, height: 240, minWidth: 320, maxWidth: 360 };
      } else {
        return { width: 180, height: 44, minWidth: 180, maxWidth: 200 };
      }
    } else if (currentMode === 'agent-call') {
      // 来电模式
      return { width: 360, height: 120, minWidth: 360, maxWidth: 400 };
    } else if (currentMode === 'media-player') {
      // 媒体播放器模式
      return { width: 380, height: 100, minWidth: 380, maxWidth: 420 };
    } else if (currentMode === 'app-content') {
      // 应用内容模式
      return { width: 320, height: 140, minWidth: 320, maxWidth: 360 };
    } else if (isExpanded) {
      return { width: 'auto', height: 60, minWidth: 280, maxWidth: 400 };
    } else {
      return { width: 120, height: 40, minWidth: 120, maxWidth: 120 };
    }
  };

  const size = getSize();

  // VisionOS 玻璃态样式 - 更精致的多层效果
  const glassStyles = "relative bg-white/[0.08] backdrop-blur-[40px] border border-white/[0.12] shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)] saturate-[150%]";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.25, 0.8, 0.25, 1],
            type: 'spring',
            stiffness: 300,
            damping: 25
          }}
          className={`fixed top-8 left-1/2 -translate-x-1/2 z-[70] ${
            (currentMode === 'idle' || currentMode === 'compact') && onSendMessage ? 'cursor-pointer' : ''
          }`}
          onClick={handleClick}
        >
          <div className="relative">
            {/* VisionOS Ambient Glow - 更自然的光晕效果 */}
            <motion.div 
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(168,85,247,0.20) 50%, rgba(236,72,153,0.15) 100%)",
                filter: "blur(32px)"
              }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 3,
                repeat: 10000,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
            
            {/* Dynamic Island Container - 统一玻璃态设计 */}
            <motion.div
              initial={{ width: 120, height: 40 }}
              animate={{ 
                width: size.width,
                height: size.height,
                minWidth: size.minWidth,
                maxWidth: size.maxWidth
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1] // 更流畅的弹性缓动
              }}
              className={`relative rounded-full ${glassStyles} overflow-hidden`}
              style={{
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {/* VisionOS Gradient Border - 更细腻的渐变边框光泽 */}
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.2) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '1px'
              }} />
              
              {/* Subtle Inner Highlight */}
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 50%)'
              }} />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center px-5">
                <AnimatePresence mode="wait">
                  {currentMode === 'compact' && (
                    // 紧凑模式 - 仅图标
                    <motion.div
                      key="compact"
                      initial={{ scale: 0, opacity: 0, rotate: -180 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 180 }}
                      transition={{ 
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="flex items-center justify-center"
                    >
                      <motion.div 
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center"
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: 10000, repeatType: "loop", ease: "linear" },
                          scale: { duration: 2, repeat: 10000, repeatType: "loop", ease: "easeInOut" }
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-blue-300" />
                      </motion.div>
                    </motion.div>
                  )}

                  {currentMode === 'idle' && (
                    // 空闲模式 - 欢迎消息
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3 w-full"
                    >
                      {isExpanded ? (
                        <>
                          <motion.div 
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/20 flex-shrink-0"
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          >
                            {getIcon()}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <motion.span 
                              className="text-white/90 text-sm line-clamp-2"
                              animate={{ opacity: [0.8, 1, 0.8] }}
                              transition={{ duration: 3, repeat: 10000, repeatType: "loop" }}
                            >
                              {message}
                            </motion.span>
                          </div>
                        </>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/20">
                          {getIcon()}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentMode === 'input' && (
                    // 输入模式 - 增强版输入框
                    <motion.div
                      key="input"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col gap-2.5 w-full py-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {/* 图标 */}
                        <motion.div 
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/20 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          {getIcon()}
                        </motion.div>
                        
                        {/* 输入框 - 统一玻璃态 */}
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={placeholder}
                            autoFocus
                            className="w-full bg-gradient-to-r from-white/8 via-white/12 to-white/8 text-white/90 placeholder:text-white/40 px-4 py-2.5 rounded-2xl text-sm outline-none focus:from-white/15 focus:via-white/20 focus:to-white/15 transition-all border border-white/15 focus:border-blue-400/50 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm"
                          />
                          {/* 输入活跃指示器 */}
                          {inputValue && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <motion.div 
                                className="w-2 h-2 rounded-full bg-blue-400"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: 10000, repeatType: "loop" }}
                              />
                            </motion.div>
                          )}
                        </div>
                        
                        {/* 附件按钮 */}
                        <motion.button
                          whileHover={{ scale: 1.15, rotate: -15 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/25 to-pink-500/25 hover:from-purple-500/35 hover:to-pink-500/35 border border-purple-400/30 flex items-center justify-center transition-all flex-shrink-0 shadow-lg"
                          title="Attach file"
                        >
                          <Paperclip className="w-4 h-4 text-purple-300" />
                        </motion.button>
                        
                        {/* 语音按钮 */}
                        {showVoiceButton && (
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleVoiceToggle}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-lg ${
                              isRecording 
                                ? 'bg-gradient-to-br from-red-500/40 to-pink-500/40 border border-red-400/50 shadow-red-500/25' 
                                : 'bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-400/30 hover:from-emerald-500/40 hover:to-teal-500/40'
                            }`}
                            title={isRecording ? 'Stop recording' : 'Voice input'}
                          >
                            <Mic className={`w-4 h-4 ${isRecording ? 'text-red-300' : 'text-emerald-300'}`} />
                          </motion.button>
                        )}
                        
                        {/* 发送按钮 */}
                        {showSendButton && (
                          <motion.button
                            whileHover={{ scale: inputValue.trim() ? 1.15 : 1 }}
                            whileTap={{ scale: inputValue.trim() ? 0.9 : 1 }}
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 shadow-lg ${
                              inputValue.trim()
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/25 border border-blue-400/30'
                                : 'bg-white/5 cursor-not-allowed border border-white/10'
                            }`}
                            title="Send message"
                          >
                            <Send className={`w-4 h-4 ${inputValue.trim() ? 'text-white' : 'text-white/30'}`} />
                          </motion.button>
                        )}
                        
                        {/* 关闭按钮 - 修复点击逻辑 */}
                        <motion.button
                          whileHover={{ scale: 1.15, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation(); // 防止触发父级点击
                            handleClose();
                          }}
                          className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 flex items-center justify-center transition-all flex-shrink-0"
                          title="Close"
                        >
                          <X className="w-4 h-4 text-white/70 hover:text-red-400" />
                        </motion.button>
                      </div>
                      
                      {/* 快捷功能栏 */}
                      <AnimatePresence>
                        {!inputValue && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center gap-2 px-10 overflow-x-auto scrollbar-hide pb-1">
                              {[
                                { icon: Search, label: 'Search', prompt: 'Search for ' },
                                { icon: Code, label: 'Code', prompt: 'Generate code for ' },
                                { icon: ImageIcon, label: 'Image', prompt: 'Generate an image of ' },
                                { icon: Languages, label: 'Translate', prompt: 'Translate ' },
                                { icon: FileText, label: 'Summarize', prompt: 'Summarize ' },
                                { icon: Globe, label: 'Browse', prompt: 'Browse ' },
                                { icon: Sparkles, label: 'Create', prompt: 'Create ' },
                              ].map((action, index) => (
                                <motion.button
                                  key={action.label}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ delay: index * 0.04 }}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setInputValue(action.prompt)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-white/8 to-white/12 hover:from-white/15 hover:to-white/20 border border-white/15 hover:border-white/25 text-white/70 hover:text-white/95 text-xs whitespace-nowrap transition-all shadow-sm hover:shadow-md backdrop-blur-sm"
                                  title={action.label}
                                >
                                  <action.icon className="w-3.5 h-3.5" />
                                  <span>{action.label}</span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {currentMode === 'awakening' && (
                    // 唤醒模式
                    <motion.div
                      key="awakening"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-3 w-full h-full relative"
                    >
                      <VoiceWaveform mode="awakening" barCount={30} isActive={true} />
                      <div className="relative z-10 flex items-center gap-3 w-full px-4">
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center border border-blue-400/50 flex-shrink-0 backdrop-blur-sm"
                          animate={{ 
                            scale: [1, 1.15, 1],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: 10000,
                            repeatType: "loop",
                            ease: "easeInOut"
                          }}
                        >
                          <Sparkles className="w-5 h-5 text-blue-300" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <motion.span 
                            className="text-white/90 text-sm"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            Awakening...
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentMode === 'listening' && (
                    // 收听模式
                    <motion.div
                      key="listening"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-3 w-full h-full relative"
                    >
                      <VoiceWaveform mode="listening" barCount={50} isActive={true} />
                      <div className="relative z-10 flex items-center gap-3 w-full px-4">
                        <motion.div 
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/40 to-pink-500/40 flex items-center justify-center border border-red-400/50 flex-shrink-0 backdrop-blur-sm"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <Mic className="w-5 h-5 text-red-300" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white/90 text-sm">
                            Listening...
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVoiceToggle();
                          }}
                          className="w-9 h-9 rounded-full bg-red-500/30 hover:bg-red-500/40 flex items-center justify-center transition-all flex-shrink-0 border border-red-400/50 backdrop-blur-sm"
                        >
                          <X className="w-4 h-4 text-red-300" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {currentMode === 'processing' && (
                    // 处理中
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 w-full"
                    >
                      <motion.div 
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-500/50 flex-shrink-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4 text-blue-400" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <span className="text-white/90 text-sm">
                          {message}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {currentMode === 'notification' && (
                    // 通知模式
                    <motion.div
                      key="notification"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 w-full"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/20 flex-shrink-0">
                        {getIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-white/90 text-sm line-clamp-2">
                          {message}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {currentMode === 'model-selector' && (
                    // 模型选择模式
                    <motion.div
                      key="model-selector"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col gap-2 w-full py-2"
                    >
                      {!showModelSelector ? (
                        // 紧凑视图：显示当前模型
                        <div className="flex items-center gap-2 px-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></div>
                          <span className="text-white/90 text-sm">
                            {MODEL_DISPLAY_NAMES[selectedModel] || selectedModel}
                          </span>
                          <motion.div
                            animate={{ rotate: showModelSelector ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-blue-300 ml-1" />
                          </motion.div>
                        </div>
                      ) : (
                        // 展开视图：显示模型列表
                        <div className="flex flex-col gap-1.5 px-2">
                          <div className="text-white/60 text-xs px-2 mb-1">Select Model</div>
                          {Object.entries(MODEL_DISPLAY_NAMES).map(([key, name]) => (
                            <motion.button
                              key={key}
                              whileHover={{ scale: 1.02, x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onModelSelect?.(key);
                                setShowModelSelector(false);
                                setIsExpanded(false);
                              }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                selectedModel === key
                                  ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50'
                                  : 'bg-white/5 hover:bg-white/10 border border-white/10'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full ${
                                selectedModel === key 
                                  ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' 
                                  : 'bg-white/30'
                              }`}></div>
                              <span className={`text-sm flex-1 text-left ${
                                selectedModel === key ? 'text-white' : 'text-white/70'
                              }`}>
                                {name}
                              </span>
                              {selectedModel === key && (
                                <Check className="w-4 h-4 text-blue-400" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {currentMode === 'agent-call' && (
                    // Agent 来电模式
                    <motion.div
                      key="agent-call"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col gap-3 w-full py-3"
                    >
                      {/* Agent 信息 */}
                      <div className="flex items-center gap-3 px-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center border-2 border-blue-400/50 flex-shrink-0">
                          {agentAvatar ? (
                            <img src={agentAvatar} alt={agentName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-blue-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm">{agentName}</div>
                          <div className="text-white/60 text-xs">
                            {callDuration > 0 ? `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}` : 'Incoming call...'}
                          </div>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex items-center justify-center gap-3 px-4">
                        {callDuration === 0 ? (
                          <>
                            {/* 接听 */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAcceptCall?.();
                              }}
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/40 to-emerald-500/40 hover:from-green-500/60 hover:to-emerald-500/60 border border-green-400/50 flex items-center justify-center transition-all shadow-lg"
                            >
                              <Phone className="w-5 h-5 text-green-200" />
                            </motion.button>
                            
                            {/* 保留 */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onHoldCall?.();
                              }}
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/40 to-orange-500/40 hover:from-yellow-500/60 hover:to-orange-500/60 border border-yellow-400/50 flex items-center justify-center transition-all shadow-lg"
                            >
                              <PhoneMissed className="w-5 h-5 text-yellow-200" />
                            </motion.button>
                            
                            {/* 拒绝 */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onRejectCall?.();
                              }}
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/40 to-pink-500/40 hover:from-red-500/60 hover:to-pink-500/60 border border-red-400/50 flex items-center justify-center transition-all shadow-lg"
                            >
                              <PhoneOff className="w-5 h-5 text-red-200" />
                            </motion.button>
                          </>
                        ) : (
                          // 通话中 - 仅显示挂断按钮
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onRejectCall?.();
                            }}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500/50 to-pink-500/50 hover:from-red-500/70 hover:to-pink-500/70 border-2 border-red-400/60 flex items-center justify-center transition-all shadow-lg"
                          >
                            <PhoneOff className="w-6 h-6 text-red-200" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {currentMode === 'media-player' && (
                    // 媒体播放器模式
                    <motion.div
                      key="media-player"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col gap-2 w-full py-3"
                    >
                      {/* 媒体信息 */}
                      <div className="flex items-center gap-3 px-4">
                        {mediaCover && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                            <img src={mediaCover} alt={mediaTitle} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm truncate">{mediaTitle}</div>
                          <div className="text-white/60 text-xs truncate">{mediaArtist}</div>
                        </div>
                        <Volume2 className="w-4 h-4 text-white/60 flex-shrink-0" />
                      </div>
                      
                      {/* 进度条 */}
                      <div className="px-4">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</span>
                          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                            />
                          </div>
                          <span>{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                      
                      {/* 控制按钮 */}
                      <div className="flex items-center justify-center gap-4 px-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSkipBack?.();
                          }}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <SkipBack className="w-4 h-4 text-white/80" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayPause?.();
                          }}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 hover:from-blue-500/60 hover:to-purple-500/60 border border-blue-400/50 flex items-center justify-center transition-all shadow-lg"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSkipForward?.();
                          }}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                        >
                          <SkipForward className="w-4 h-4 text-white/80" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {currentMode === 'app-content' && (
                    // 应用内容模式
                    <motion.div
                      key="app-content"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col gap-2 w-full py-3 px-4"
                    >
                      {contentType === 'weather' && (
                        <div className="flex items-center gap-3">
                          <Cloud className="w-10 h-10 text-blue-300" />
                          <div className="flex-1">
                            <div className="text-white text-2xl">{contentData?.temp || '22'}°</div>
                            <div className="text-white/60 text-xs">{contentData?.condition || 'Partly Cloudy'}</div>
                          </div>
                        </div>
                      )}
                      
                      {contentType === 'calendar' && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-8 h-8 text-purple-300" />
                          <div className="flex-1">
                            <div className="text-white text-sm">{contentData?.event || 'Meeting'}</div>
                            <div className="text-white/60 text-xs">{contentData?.time || '2:00 PM'}</div>
                          </div>
                        </div>
                      )}
                      
                      {contentType === 'notification' && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center border border-blue-400/50 flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-blue-300" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white text-sm">{contentData?.title || 'Notification'}</div>
                            <div className="text-white/60 text-xs line-clamp-2">{contentData?.message || 'You have a new message'}</div>
                          </div>
                        </div>
                      )}
                      
                      {contentType === 'custom' && contentData}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

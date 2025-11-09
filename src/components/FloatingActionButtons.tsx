import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Zap, Paperclip, Search, Globe, Square, Infinity, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface FloatingActionButtonsProps {
  // 消息发送
  onSendMessage?: (message: string, isVoice?: boolean) => void;
  
  // 触发灵动岛的语音助手
  onTriggerIslandVoice?: () => void;
  
  // 其他功能
  onNewChat?: () => void;
  onShowNotification?: (message: string, type: string) => void;
  
  // 录音状态（视觉反馈）
  isRecording?: boolean;
}

export function FloatingActionButtons({ 
  onSendMessage,
  onTriggerIslandVoice,
  onNewChat,
  onShowNotification,
  isRecording = false,
}: FloatingActionButtonsProps) {
  // 状态管理
  const [isExpanded, setIsExpanded] = useState(false); // 是否展开输入框
  const [inputValue, setInputValue] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isVoiceMessage, setIsVoiceMessage] = useState(false); // 语音消息模式（不是语音助手）
  const [voiceMessageTime, setVoiceMessageTime] = useState(0);
  
  // 🎤 新增：长按进度状态
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0-100
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 点击 ∞ 按钮：展开输入框
  const handleExpandInput = () => {
    setIsExpanded(true);
    // 延迟聚焦，等待动画完成
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 350);
  };

  // 收缩输入框（点击 ∞）
  const handleCollapse = () => {
    setIsExpanded(false);
    setInputValue('');
    setIsVoiceMessage(false);
    setShowMoreMenu(false);
    setIsHolding(false);
    setHoldProgress(0);
    
    // 清理所有定时器
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // ✨ 智能按钮：有内容=发送，无内容=语音助手
  const handleSmartAction = () => {
    if (inputValue.trim()) {
      // 有内容：发送消息
      handleSend();
    } else {
      // 无内容：触发灵动岛语音助手
      onTriggerIslandVoice?.();
    }
  };

  // 发送消息
  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue, isVoiceMessage);
      setInputValue('');
      setIsVoiceMessage(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      // 发送后收缩
      handleCollapse();
    }
  };

  // 按键处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSend();
      }
    }
  };

  // 附件处理
  const handleAttachmentClick = () => {
    setShowMoreMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onShowNotification?.(`${files.length} file(s) selected`, 'success');
    }
  };

  // 🎤 长按输入框 3 秒开启语音消息模式
  const handleMouseDown = () => {
    // 如果已经有内容，不触发长按
    if (inputValue.trim()) return;
    
    setIsHolding(true);
    setHoldProgress(0);
    
    // 进度条动画：每30ms更新一次，3秒完成
    const totalTime = 3000; // 3秒
    const updateInterval = 30; // 30ms更新一次
    const totalSteps = totalTime / updateInterval;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / totalSteps) * 100;
      setHoldProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, updateInterval);
    
    holdIntervalRef.current = progressInterval;
    
    // 3秒后启动语音消息模式
    const timer = setTimeout(() => {
      setIsHolding(false);
      setHoldProgress(0);
      setIsVoiceMessage(true);
      setVoiceMessageTime(0);
      onShowNotification?.('Voice message mode activated', 'success');
      
      // 开始录音计时
      const interval = setInterval(() => {
        setVoiceMessageTime(prev => prev + 1);
      }, 1000);
      
      voiceIntervalRef.current = interval;
    }, totalTime);
    
    longPressTimerRef.current = timer;
  };

  const handleMouseUp = () => {
    // 清理长按定时器和进度
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    
    setIsHolding(false);
    setHoldProgress(0);
  };

  // 停止语音消息
  const handleStopVoiceMessage = () => {
    // 清理录音计时器
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
      voiceIntervalRef.current = null;
    }
    
    setIsVoiceMessage(false);
    const recordTime = voiceMessageTime;
    setVoiceMessageTime(0);
    onShowNotification?.('Voice message ready to send', 'success');
    setInputValue(`[Voice Message ${recordTime}s]`);
  };

  // 自动调整 textarea 高度
  useEffect(() => {
    if (textareaRef.current && isExpanded && !isVoiceMessage) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // 最大高度
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [inputValue, isExpanded, isVoiceMessage]);

  // 清理定时器（组件卸载时）
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (voiceIntervalRef.current) {
        clearInterval(voiceIntervalRef.current);
      }
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  // 计算容器宽度（智能响应文本长度 + 设备尺寸）
  const getContainerWidth = () => {
    if (!isExpanded) {
      return 'auto'; // 初始状态
    }
    
    const windowWidth = window.innerWidth;
    
    // 根据设备尺寸调整基础宽度
    let baseWidth = 360;
    let maxWidth = 720;
    
    if (windowWidth < 375) {
      // iPhone SE, small phones
      baseWidth = 280;
      maxWidth = windowWidth - 32;
    } else if (windowWidth < 430) {
      // Standard phones (iPhone 12/13/14)
      baseWidth = 320;
      maxWidth = windowWidth - 32;
    } else if (windowWidth < 768) {
      // Large phones (iPhone 14 Pro Max)
      baseWidth = 360;
      maxWidth = windowWidth - 32;
    } else if (windowWidth < 1024) {
      // Tablets (iPad Mini)
      baseWidth = 480;
      maxWidth = 680;
    } else if (windowWidth < 1280) {
      // Large tablets (iPad Pro)
      baseWidth = 520;
      maxWidth = 720;
    } else {
      // Desktop
      baseWidth = 560;
      maxWidth = 840;
    }
    
    // 根据文本长度动态增加宽度
    const textLength = inputValue.length;
    const extraWidth = Math.min(textLength * 1.5, maxWidth - baseWidth);
    const totalWidth = baseWidth + extraWidth;
    
    return Math.min(totalWidth, maxWidth);
  };

  // 计算倒计时（3秒 - 当前进度）
  const getCountdown = () => {
    return Math.max(0, 3 - Math.floor(holdProgress / 33.33));
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      {/* 彩虹边框容器 - 紧贴胶囊 */}
      <div className="rainbow-border-animated rounded-full">
        {/* 胶囊容器 - 智能扩展/收缩 */}
        <motion.div
          animate={{
            width: getContainerWidth(),
          }}
          transition={{
            duration: 0.25,
            ease: [0.34, 1.56, 0.64, 1], // 弹性缓动
          }}
          className="liquid-glass-container shadow-3d-container rounded-full p-2 relative"
        >
          {/* 内部液态光效 - 更透明 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/5 via-purple-500/8 to-blue-500/5 liquid-animated pointer-events-none" />
          
          {/* 顶部高光 - 增强玻璃质感 */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[40%] bg-gradient-to-b from-white/12 to-transparent rounded-t-full blur-sm pointer-events-none" />
          
          {/* 底部阴影 - 轻微减淡 */}
          <div className="absolute bottom-0 left-[15%] right-[15%] h-[30%] bg-gradient-to-t from-black/12 to-transparent rounded-b-full blur-sm pointer-events-none" />
          
          {/* 🎤 Holding 进度条 - 底部蓝紫渐变 */}
          <AnimatePresence>
            {isHolding && holdProgress > 0 && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-full"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                  style={{
                    width: `${holdProgress}%`,
                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(168, 85, 247, 0.4)'
                  }}
                  transition={{ duration: 0.03 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              /* 初始状态：[∞横] [✨] */
              <motion.div
                key="compact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 0.15 }
                }}
                className="flex items-center gap-2"
              >
                {/* ∞ 横着展开按钮 - 品牌蓝紫 */}
                <motion.button
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  onClick={handleExpandInput}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center border border-blue-400/20 hover:border-blue-400/30 transition-colors relative"
                  style={{
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25), 0 8px 32px rgba(168, 85, 247, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                  title="Open Input"
                >
                  <Infinity className="w-7 h-7 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]" strokeWidth={2.5} />
                </motion.button>
                
                {/* ✨ 智能按钮 - 琥珀橙 */}
                <motion.button
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                  }}
                  onClick={handleSmartAction}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all relative ${
                    isRecording
                      ? 'bg-gradient-to-br from-red-500/40 to-pink-600/40 border-red-400/30 animate-pulse'
                      : 'bg-gradient-to-br from-amber-500/30 to-yellow-600/30 border-amber-400/20 hover:border-amber-400/30'
                  }`}
                  style={{
                    boxShadow: isRecording
                      ? '0 4px 16px rgba(239, 68, 68, 0.3), 0 8px 32px rgba(236, 72, 153, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                      : '0 4px 16px rgba(245, 158, 11, 0.25), 0 8px 32px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                  title="Send / Voice Assistant"
                >
                  <Sparkles className="w-6 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.5)]" strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            ) : (
              /* 扩展状态：[∞竖] [⚡] [输入框] [✨] */
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 0.15 }
                }}
                className="flex items-center gap-2 w-full"
              >
                {!isVoiceMessage ? (
                  <>
                    {/* ∞ 竖着关闭按钮（最左侧）- 危险红 */}
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ 
                        scale: 0,
                        transition: {
                          duration: 0.2,
                          ease: [0.34, 1.56, 0.64, 1]
                        }
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={handleCollapse}
                      className="w-11 h-11 rounded-full bg-red-500/25 hover:bg-red-500/35 border border-red-400/20 hover:border-red-400/30 flex items-center justify-center transition-all flex-shrink-0 relative"
                      style={{
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2), 0 6px 24px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
                      }}
                      title="Close"
                    >
                      <Infinity className="w-6 h-6 text-red-300 rotate-90 drop-shadow-[0_2px_6px_rgba(252,165,165,0.6)]" strokeWidth={2.5} />
                    </motion.button>
                    
                    {/* ⚡ 合并菜单按钮 - 功能紫粉 */}
                    <div className="relative flex-shrink-0">
                      <motion.button
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ 
                          scale: 0, 
                          rotate: 180,
                          transition: {
                            duration: 0.2,
                            ease: [0.34, 1.56, 0.64, 1]
                          }
                        }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: 0.03,
                        }}
                        whileHover={{ scale: 1.15, rotate: 15 }}
                        whileTap={{ scale: 0.85, rotate: -15 }}
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500/25 to-pink-600/25 hover:from-purple-500/35 hover:to-pink-600/35 flex items-center justify-center transition-all border border-purple-400/20 hover:border-purple-400/30 relative"
                        style={{
                          boxShadow: '0 4px 16px rgba(168, 85, 247, 0.25), 0 8px 32px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                        }}
                        title="More Options & Attachments"
                      >
                        <Zap className="w-5 h-5 text-purple-300 drop-shadow-[0_2px_8px_rgba(216,180,254,0.6)]" strokeWidth={2.5} />
                      </motion.button>
                      
                      {/* 合并菜单 - VisionOS 玻璃风格 */}
                      <AnimatePresence>
                        {showMoreMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full right-0 mb-2 w-64 glass-standard rounded-[20px] overflow-hidden"
                            style={{
                              boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08)'
                            }}
                          >
                            {/* 附件上传 */}
                            <button
                              onClick={handleAttachmentClick}
                              className="w-full px-4 py-3.5 text-left text-white/90 hover:bg-white/10 transition-all flex items-center gap-3 group"
                            >
                              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                                <Paperclip className="w-4 h-4 text-blue-300 drop-shadow-[0_2px_6px_rgba(147,197,253,0.6)]" />
                              </div>
                              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Attach Files</span>
                            </button>
                            
                            <div className="border-t border-white/10" />
                            
                            {/* 网络搜索 - 成功翠绿 */}
                            <button
                              onClick={() => {
                                setShowMoreMenu(false);
                                onShowNotification?.('Web search coming soon!', 'info');
                              }}
                              className="w-full px-4 py-3.5 text-left text-white/90 hover:bg-white/10 transition-all flex items-center gap-3 group"
                            >
                              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                                <Search className="w-4 h-4 text-emerald-300 drop-shadow-[0_2px_6px_rgba(110,231,183,0.6)]" />
                              </div>
                              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Web Search</span>
                            </button>
                            
                            <div className="border-t border-white/10" />
                            
                            {/* MCP - 功能紫粉 */}
                            <button
                              onClick={() => {
                                setShowMoreMenu(false);
                                onShowNotification?.('MCP integration coming soon!', 'info');
                              }}
                              className="w-full px-4 py-3.5 text-left text-white/90 hover:bg-white/10 transition-all flex items-center gap-3 group"
                            >
                              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                                <Globe className="w-4 h-4 text-purple-300 drop-shadow-[0_2px_6px_rgba(216,180,254,0.6)]" />
                              </div>
                              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">MCP Tools</span>
                            </button>
                            
                            <div className="border-t border-white/10" />
                            
                            {/* 图片生成 - 强调琥珀橙 */}
                            <button
                              onClick={() => {
                                setShowMoreMenu(false);
                                onShowNotification?.('Image generation coming soon!', 'info');
                              }}
                              className="w-full px-4 py-3.5 text-left text-white/90 hover:bg-white/10 transition-all flex items-center gap-3 group"
                            >
                              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center group-hover:bg-amber-500/30 transition-all">
                                <Sparkles className="w-4 h-4 text-amber-300 drop-shadow-[0_2px_6px_rgba(252,211,77,0.6)]" />
                              </div>
                              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Generate Image</span>
                            </button>
                            
                            <div className="border-t border-white/10" />
                            
                            {/* 新对话 */}
                            <button
                              onClick={() => {
                                setShowMoreMenu(false);
                                onNewChat?.();
                              }}
                              className="w-full px-4 py-3.5 text-left text-white/90 hover:bg-white/10 transition-all drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                            >
                              New Chat
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* 隐藏的文件输入 */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    
                    {/* 文本输入框 */}
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ 
                        width: 0, 
                        opacity: 0,
                        transition: {
                          duration: 0.18,
                          ease: [0.34, 1.56, 0.64, 1]
                        }
                      }}
                      transition={{ 
                        duration: 0.22,
                        ease: [0.34, 1.56, 0.64, 1],
                        delay: 0.05,
                      }}
                      className="flex-1 min-w-0 relative"
                    >
                      {/* 输入框容器 - 液化玻璃效果 */}
                      <div className="liquid-glass-input shadow-3d-soft px-3 py-2 relative">
                        {/* 内部微光效果 */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                        
                        {/* 🎤 Type or Hold 居中提示 - 空状态时显示 */}
                        <AnimatePresence>
                          {!inputValue && !isHolding && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ 
                                opacity: [0.4, 0.7, 0.4],
                                scale: [0.98, 1.02, 0.98]
                              }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{
                                opacity: { duration: 2.5, repeat: 10000, repeatType: "loop", ease: "easeInOut" },
                                scale: { duration: 2.5, repeat: 10000, repeatType: "loop", ease: "easeInOut" }
                              }}
                              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                            >
                              <span className="text-white/40 text-sm">
                                Type or Hold
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* 🎤 Holding 状态提示 */}
                        <AnimatePresence>
                          {isHolding && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none z-0"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: 10000, repeatType: "loop", ease: "linear" }}
                              >
                                <Mic className="w-4 h-4 text-blue-400 drop-shadow-[0_2px_8px_rgba(96,165,250,0.6)]" />
                              </motion.div>
                              <span className="text-white/90 text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                Hold to speak... {getCountdown()}s
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <textarea
                          ref={textareaRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onMouseDown={handleMouseDown}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                          onTouchStart={handleMouseDown}
                          onTouchEnd={handleMouseUp}
                          placeholder=""
                          className="w-full bg-transparent text-white/90 placeholder:text-transparent resize-none outline-none relative z-10"
                          rows={1}
                          style={{
                            minHeight: '24px',
                            maxHeight: '120px',
                          }}
                        />
                      </div>
                    </motion.div>
                    
                    {/* ✨ 智能按钮 - 品牌蓝紫（有内容）/ 琥珀橙（无内容）*/}
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ 
                        scale: 0, 
                        rotate: 180,
                        transition: {
                          duration: 0.2,
                          ease: [0.34, 1.56, 0.64, 1]
                        }
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: 0.06,
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={handleSmartAction}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 relative ${
                        inputValue.trim()
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border border-blue-400/30'
                          : isRecording
                          ? 'bg-gradient-to-br from-red-500/40 to-pink-600/40 animate-pulse border border-red-400/30'
                          : 'bg-gradient-to-br from-amber-500/30 to-yellow-600/30 hover:from-amber-500/40 hover:to-yellow-600/40 border border-amber-400/20 hover:border-amber-400/30'
                      }`}
                      style={{
                        boxShadow: inputValue.trim()
                          ? '0 4px 16px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(168, 85, 247, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                          : isRecording
                          ? '0 4px 16px rgba(239, 68, 68, 0.3), 0 8px 32px rgba(236, 72, 153, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                          : '0 4px 16px rgba(245, 158, 11, 0.25), 0 8px 32px rgba(251, 191, 36, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                      title={inputValue.trim() ? 'Send Message' : 'Voice Assistant'}
                    >
                      <AnimatePresence mode="wait">
                        {inputValue.trim() ? (
                          <motion.div
                            key="send"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.18 }}
                          >
                            <Send className="w-5 h-5 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" strokeWidth={2.5} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="sparkles"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Sparkles className="w-5 h-5 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </>
                ) : (
                  /* 语音消息模式 */
                  <>
                    {/* ∞ 竖着关闭按钮（最左侧）- 危险红 */}
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={handleCollapse}
                      className="w-11 h-11 rounded-full bg-red-500/25 hover:bg-red-500/35 border border-red-400/20 hover:border-red-400/30 flex items-center justify-center transition-all flex-shrink-0 relative"
                      style={{
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2), 0 6px 24px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
                      }}
                      title="Close"
                    >
                      <Infinity className="w-6 h-6 text-red-300 rotate-90 drop-shadow-[0_2px_6px_rgba(252,165,165,0.6)]" strokeWidth={2.5} />
                    </motion.button>
                    
                    {/* 停止录音按钮 - 危险红 */}
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.03 }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={handleStopVoiceMessage}
                      className="w-11 h-11 rounded-full bg-red-500/40 hover:bg-red-500/60 border border-red-400/40 flex items-center justify-center transition-all flex-shrink-0 relative"
                      style={{
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3), 0 8px 32px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                      title="Stop Recording"
                    >
                      <Square className="w-5 h-5 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" strokeWidth={2.5} />
                    </motion.button>
                    
                    {/* 录音中提示 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: 10000, repeatType: "loop" }}
                        className="w-2 h-2 rounded-full bg-red-400"
                        style={{
                          boxShadow: '0 0 8px rgba(248, 113, 113, 0.6)'
                        }}
                      />
                      <span className="text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Recording... {voiceMessageTime}s</span>
                    </motion.div>
                    
                    {/* 发送按钮 - 品牌蓝紫 */}
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.06 }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={handleSend}
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border border-blue-400/30 flex items-center justify-center transition-all flex-shrink-0 relative"
                      style={{
                        boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(168, 85, 247, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                      }}
                      title="Send Voice Message"
                    >
                      <Send className="w-5 h-5 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.6)]" strokeWidth={2.5} />
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

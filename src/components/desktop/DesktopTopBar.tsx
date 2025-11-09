import { motion } from 'motion/react';
import { ChevronDown, Sparkles, Video } from 'lucide-react';

interface DesktopTopBarProps {
  selectedModel: string;
  onModelClick: () => void;
  currentView: 'home' | 'chat';
  onIslandIconClick?: () => void;
  showIslandIcon?: boolean;
  onVideoCallClick?: () => void;
}

export function DesktopTopBar({ 
  selectedModel, 
  onModelClick, 
  currentView,
  onIslandIconClick,
  showIslandIcon = false,
  onVideoCallClick
}: DesktopTopBarProps) {
  return (
    <div className="h-16 border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-[#0a0e27]/80 via-[#1a1f3a]/70 to-[#0a0e27]/80 flex items-center justify-between px-6">
      {/* Left: Current View Title */}
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h1 className="text-white/90 text-lg">
            {currentView === 'home' ? 'Welcome' : 'Chat'}
          </h1>
        </motion.div>
      </div>

      {/* Center: Model Selector with Island Icon */}
      <div className="flex items-center gap-3">
        {/* Dynamic Island Icon - 独立的按钮 */}
        {showIslandIcon && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onIslandIconClick?.();
            }}
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/20 hover:border-blue-400/50 transition-all cursor-pointer"
            title="Open AI Assistant"
          >
            {/* 彩虹光晕 */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-md"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: 10000,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            />
            {/* 图标 */}
            <motion.div
              className="relative z-10"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: 10000,
                repeatType: "loop",
                ease: "linear"
              }}
            >
              <Sparkles className="w-4 h-4 text-blue-300" />
            </motion.div>
            {/* 脉动圆环 */}
            <motion.div
              className="absolute inset-0 rounded-full border border-blue-400/50"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: 10000,
                repeatType: "loop",
                ease: "easeOut"
              }}
            />
          </motion.button>
        )}
        
        {/* Model Selector Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onModelClick}
          className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 backdrop-blur-xl transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="text-white/90">{selectedModel}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
        </motion.button>
      </div>

      {/* Right: Additional Actions */}
      <div className="flex items-center gap-3">
        {/* Video Call Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onVideoCallClick}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center transition-all"
        >
          <Video className="w-4.5 h-4.5 text-white/80" />
        </motion.button>
        
        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="text-white/60 text-sm">Desktop Mode</span>
        </div>
      </div>
    </div>
  );
}

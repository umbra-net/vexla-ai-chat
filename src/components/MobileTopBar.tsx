import { Menu, ChevronDown, Video, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from 'motion/react';

interface MobileTopBarProps {
  onMenuClick: () => void;
  onVideoCallClick?: () => void;
  onModelClick?: () => void;
  selectedModel?: string;
  showIslandIcon?: boolean;
  onIslandIconClick?: () => void;
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'vexla-ultra': 'Vexla Ultra',
  'vexla-max': 'Vexla Max',
  'vexla-pro': 'Vexla Pro',
  'vexla': 'Vexla'
};

export function MobileTopBar({ 
  onMenuClick, 
  onVideoCallClick, 
  onModelClick, 
  selectedModel = 'vexla-ultra',
  showIslandIcon = false,
  onIslandIconClick
}: MobileTopBarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-2.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 border-0 transition-all duration-150 hover:scale-110 active:scale-95"
      >
        <Menu className="w-4.5 h-4.5 text-white/80" />
      </Button>

      <div className="flex items-center gap-3">
        {/* Dynamic Island Icon - 独立按钮 */}
        {showIslandIcon && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onIslandIconClick?.();
            }}
            whileHover={{ scale: 1.2, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/20 hover:border-blue-400/50 transition-all cursor-pointer"
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

      </div>

      {/* Video Call Button - 替换刷新按钮 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onVideoCallClick}
        className="h-9 w-9 rounded-full bg-transparent hover:bg-white/10 border-0 transition-all duration-150 hover:scale-110 active:scale-95"
      >
        <Video className="w-4.5 h-4.5 text-white/80" />
      </Button>
    </div>
  );
}

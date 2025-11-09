import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Code } from 'lucide-react';
import { useState } from 'react';

interface RightPanelTriggerProps {
  onClick: () => void;
  hasArtifact: boolean;
}

export function RightPanelTrigger({ onClick, hasArtifact }: RightPanelTriggerProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!hasArtifact) return null;

  return (
    <motion.div
      className="fixed right-0 top-0 bottom-0 z-30 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: '20px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 透明触发区域 */}
      <div className="absolute inset-0" />
      
      {/* 液态胶囊指示器 - 细窄线条 */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-full backdrop-blur-sm"
        style={{
          background: isHovered 
            ? 'linear-gradient(to left, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.2), transparent)'
            : 'linear-gradient(to left, rgba(255, 255, 255, 0.1), transparent)',
        }}
        initial={{ width: '1px', height: '120px', opacity: 0.3 }}
        animate={{
          width: isHovered ? '6px' : '1px',
          height: isHovered ? '160px' : '120px',
          opacity: isHovered ? 1 : 0.4,
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* 边框 */}
        <div 
          className="absolute right-0 top-0 bottom-0 rounded-l-full border-l border-t border-b"
          style={{
            borderColor: isHovered 
              ? 'rgba(59, 130, 246, 0.5)' 
              : 'rgba(255, 255, 255, 0.2)'
          }}
        />
      </motion.div>
      
      {/* Hover 时的光晕效果 */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-16 rounded-l-full pointer-events-none"
            style={{
              height: '200px',
              background: 'linear-gradient(to left, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.1), transparent)',
              filter: 'blur(20px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      {/* Hover 时的提示图标 */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* 图标背景 */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-md" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-300" />
              </div>
            </div>
            
            {/* 箭头指示 */}
            <motion.div
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: 10000, repeatType: 'loop', ease: 'easeInOut' }}
            >
              <ChevronLeft className="w-4 h-4 text-blue-300/80" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 脉冲指示点（未 hover 时提醒用户） */}
      {!isHovered && (
        <motion.div
          className="absolute right-0.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 2, repeat: 10000, repeatType: 'loop', ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}

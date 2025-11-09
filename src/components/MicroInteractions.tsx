/**
 * 微交互动画组件
 * 提供统一的细节动画和反馈效果
 */

import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState } from 'react';
import { Check, X, AlertCircle, Info, Loader2 } from 'lucide-react';

// ========================================
// 成功/错误/信息提示动画
// ========================================

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastProps {
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ type, message, description, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  const icons = {
    success: <Check className="w-5 h-5 text-green-400" />,
    error: <X className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-orange-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    loading: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
  };

  const colors = {
    success: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    error: 'from-red-500/20 to-rose-500/20 border-red-500/30',
    warning: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
    info: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    loading: 'from-blue-500/20 to-purple-500/20 border-blue-500/30',
  };

  // Auto-dismiss (except for loading)
  if (duration > 0 && type !== 'loading') {
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`flex items-start gap-3 p-4 rounded-2xl backdrop-blur-2xl bg-gradient-to-br ${colors[type]} border shadow-lg`}
        >
          <div className="shrink-0 mt-0.5">{icons[type]}</div>
          <div className="flex-1">
            <div className="text-white">{message}</div>
            {description && <div className="text-sm text-white/60 mt-1">{description}</div>}
          </div>
          {type !== 'loading' && (
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
              }}
              className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ========================================
// 卡片进入动画
// ========================================

interface StaggeredCardGridProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggeredCardGrid({ children, staggerDelay = 0.05, className = '' }: StaggeredCardGridProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ========================================
// 消息发送动画
// ========================================

export function MessageSendAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {children}
    </motion.div>
  );
}

// ========================================
// 打字机效果
// ========================================

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, speed = 50, className = '', onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useState(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  });

  return <span className={className}>{displayText}</span>;
}

// ========================================
// 脉动提示点
// ========================================

export function PulseDot({ color = 'blue' }: { color?: string }) {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-${color}-400 opacity-75`}
      ></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 bg-${color}-500`}></span>
    </span>
  );
}

// ========================================
// 悬浮提升效果
// ========================================

export function HoverLift({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 20 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ========================================
// 按钮加载状态
// ========================================

interface LoadingButtonProps {
  isLoading: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function LoadingButton({ isLoading, children, onClick, className = '', disabled }: LoadingButtonProps) {
  return (
    <motion.button
      whileHover={!isLoading && !disabled ? { scale: 1.05 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`relative ${className} ${isLoading || disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <span className={isLoading ? 'invisible' : 'visible'}>{children}</span>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </span>
      )}
    </motion.button>
  );
}

// ========================================
// 进度条动画
// ========================================

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color = 'blue',
  height = 'h-2',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm text-white/60">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-white/10 overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: 'easeOut',
          }}
          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
        />
      </div>
    </div>
  );
}

// ========================================
// 数字滚动动画
// ========================================

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
}

export function CountUp({ end, duration = 1000, className = '' }: CountUpProps) {
  const [count, setCount] = useState(0);

  useState(() => {
    const steps = 60;
    const increment = end / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  });

  return <span className={className}>{count}</span>;
}

// ========================================
// 闪烁提示
// ========================================

export function BlinkIndicator({ active = false }: { active?: boolean }) {
  return (
    <motion.div
      animate={{
        opacity: active ? [1, 0.3, 1] : 1,
      }}
      transition={{
        duration: 1.5,
        repeat: active ? Number.POSITIVE_INFINITY : 0,
        ease: 'easeInOut',
      }}
      className="w-2 h-2 rounded-full bg-green-500"
    />
  );
}

// ========================================
// 抖动动画（错误提示）
// ========================================

export function ShakeAnimation({ children, trigger }: { children: ReactNode; trigger: boolean }) {
  return (
    <motion.div
      animate={
        trigger
          ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.4 },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
}

// ========================================
// 淡入淡出过渡
// ========================================

export function FadeInOut({ children, show }: { children: ReactNode; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ========================================
// VisionOS 风格按钮点击反馈
// ========================================

export function VisionOSButton({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary' 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const variants = {
    primary: 'bg-white/[0.12] hover:bg-white/[0.18] border-white/[0.15]',
    secondary: 'bg-white/[0.08] hover:bg-white/[0.12] border-white/[0.12]',
    ghost: 'bg-transparent hover:bg-white/[0.05] border-transparent'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-6 py-3 rounded-2xl 
        backdrop-blur-[40px] saturate-[150%]
        border transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
      style={{
        boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
      }}
    >
      {/* Gradient Border */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none" 
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }} 
      />
      {children}
    </motion.button>
  );
}

// ========================================
// VisionOS 卡片悬停效果
// ========================================

export function VisionOSCard({ 
  children, 
  onClick, 
  className = '' 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  className?: string;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative 
        bg-white/[0.08] backdrop-blur-[40px] saturate-[150%]
        border border-white/[0.12] rounded-[20px]
        transition-all duration-300
        ${className}
      `}
      style={{
        boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.08)'
      }}
    >
      {/* Gradient Border */}
      <div 
        className="absolute inset-0 rounded-[20px] pointer-events-none" 
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.2) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }} 
      />
      {/* Inner Highlight */}
      <div 
        className="absolute inset-0 rounded-[20px] pointer-events-none" 
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 50%)'
        }} 
      />
      {children}
    </motion.div>
  );
}

// ========================================
// VisionOS 触觉反馈涟漪效果
// ========================================

export function VisionOSTapRipple({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleTap}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute w-20 h-20 rounded-full bg-white/20 pointer-events-none"
            style={{
              left: ripple.x - 40,
              top: ripple.y - 40
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * 触摸涟漪效果组件
 * Material Design 风格的触摸反馈
 */

import { useState, useRef, MouseEvent, TouchEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface TouchRippleProps {
  children: ReactNode;
  className?: string;
  color?: string;
  duration?: number;
  disabled?: boolean;
}

export function TouchRipple({
  children,
  className = '',
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 600,
  disabled = false,
}: TouchRippleProps) {
  const [ripples, setRipples] = useState<Ripple[]>();
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const createRipple = (x: number, y: number) => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;

    const newRipple: Ripple = {
      id: nextId.current++,
      x: x - rect.left,
      y: y - rect.top,
      size,
    };

    setRipples((prev) => [...(prev || []), newRipple]);

    // 动画结束后移除涟漪
    setTimeout(() => {
      setRipples((prev) => prev?.filter((r) => r.id !== newRipple.id));
    }, duration);
  };

  const handleMouseDown = (e: MouseEvent) => {
    createRipple(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    createRipple(touch.clientX, touch.clientY);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
      
      <AnimatePresence>
        {ripples?.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000 }}
            style={{
              position: 'absolute',
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              borderRadius: '50%',
              backgroundColor: color,
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ========================================
// 预设涟漪样式
// ========================================

export function PrimaryRipple({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <TouchRipple color="rgba(59, 130, 246, 0.4)" className={className}>
      {children}
    </TouchRipple>
  );
}

export function SuccessRipple({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <TouchRipple color="rgba(34, 197, 94, 0.4)" className={className}>
      {children}
    </TouchRipple>
  );
}

export function DangerRipple({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <TouchRipple color="rgba(239, 68, 68, 0.4)" className={className}>
      {children}
    </TouchRipple>
  );
}

export function GlassRipple({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <TouchRipple color="rgba(255, 255, 255, 0.2)" className={className}>
      {children}
    </TouchRipple>
  );
}

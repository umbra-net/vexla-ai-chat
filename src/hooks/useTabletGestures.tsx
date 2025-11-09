/**
 * 平板专属手势 Hook
 * 支持多指手势、悬浮窗口、分屏等平板特性
 */

import { useRef, useEffect, TouchEvent } from 'react';
import { useResponsive } from './useResponsive';

// ========================================
// 多指手势识别
// ========================================

export interface MultiTouchGestureCallbacks {
  onPinchZoom?: (scale: number) => void;
  onTwoFingerSwipeLeft?: () => void;
  onTwoFingerSwipeRight?: () => void;
  onThreeFingerSwipeUp?: () => void;
  onThreeFingerSwipeDown?: () => void;
  onRotate?: (angle: number) => void;
}

export function useMultiTouchGesture(callbacks: MultiTouchGestureCallbacks) {
  const { isTablet } = useResponsive();
  
  const initialDistance = useRef(0);
  const initialAngle = useRef(0);
  const touchStartPositions = useRef<{ x: number; y: number }[]>([]);

  // 计算两点距离
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 计算两点角度
  const getAngle = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isTablet) return;

    const touches = Array.from(e.touches);
    touchStartPositions.current = touches.map(t => ({ x: t.clientX, y: t.clientY }));

    if (touches.length === 2) {
      initialDistance.current = getDistance(touches[0], touches[1]);
      initialAngle.current = getAngle(touches[0], touches[1]);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isTablet) return;

    const touches = Array.from(e.touches);

    // 双指捏合/旋转
    if (touches.length === 2) {
      const currentDistance = getDistance(touches[0], touches[1]);
      const currentAngle = getAngle(touches[0], touches[1]);

      // 缩放
      if (callbacks.onPinchZoom && initialDistance.current > 0) {
        const scale = currentDistance / initialDistance.current;
        callbacks.onPinchZoom(scale);
      }

      // 旋转
      if (callbacks.onRotate && initialAngle.current !== 0) {
        const angleDiff = currentAngle - initialAngle.current;
        callbacks.onRotate(angleDiff);
      }
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isTablet) return;

    const touches = touchStartPositions.current;
    const changedTouches = Array.from(e.changedTouches);

    // 双指滑动检测
    if (touches.length === 2 && changedTouches.length >= 1) {
      const avgStartX = touches.reduce((sum, t) => sum + t.x, 0) / touches.length;
      const avgEndX = changedTouches.reduce((sum, t) => sum + t.clientX, 0) / changedTouches.length;
      const deltaX = avgEndX - avgStartX;

      if (Math.abs(deltaX) > 100) {
        if (deltaX > 0) {
          callbacks.onTwoFingerSwipeRight?.();
        } else {
          callbacks.onTwoFingerSwipeLeft?.();
        }
      }
    }

    // 三指滑动检测
    if (touches.length === 3 && changedTouches.length >= 1) {
      const avgStartY = touches.reduce((sum, t) => sum + t.y, 0) / touches.length;
      const avgEndY = changedTouches.reduce((sum, t) => sum + t.clientY, 0) / changedTouches.length;
      const deltaY = avgEndY - avgStartY;

      if (Math.abs(deltaY) > 100) {
        if (deltaY > 0) {
          callbacks.onThreeFingerSwipeDown?.();
        } else {
          callbacks.onThreeFingerSwipeUp?.();
        }
      }
    }

    // 重置
    initialDistance.current = 0;
    initialAngle.current = 0;
    touchStartPositions.current = [];
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// ========================================
// Apple Pencil / Stylus 支持
// ========================================

export interface StylusCallbacks {
  onPencilDraw?: (x: number, y: number, pressure: number) => void;
  onPencilTap?: () => void;
  onPencilDoubleTap?: () => void;
}

export function useStylus(callbacks: StylusCallbacks) {
  const { isTablet } = useResponsive();
  const lastTapTime = useRef(0);
  const isDrawing = useRef(false);

  const handlePointerDown = (e: PointerEvent) => {
    if (!isTablet) return;
    if (e.pointerType !== 'pen') return;

    isDrawing.current = true;

    // 检测双击
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      callbacks.onPencilDoubleTap?.();
      lastTapTime.current = 0;
    } else {
      lastTapTime.current = now;
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isTablet || !isDrawing.current) return;
    if (e.pointerType !== 'pen') return;

    // 压感信息（如果支持）
    const pressure = e.pressure || 0.5;
    callbacks.onPencilDraw?.(e.clientX, e.clientY, pressure);
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isTablet) return;
    if (e.pointerType !== 'pen') return;

    isDrawing.current = false;
    
    // 单击检测
    if (!callbacks.onPencilDoubleTap) {
      callbacks.onPencilTap?.();
    }
  };

  useEffect(() => {
    if (!isTablet) return;

    window.addEventListener('pointerdown', handlePointerDown as any);
    window.addEventListener('pointermove', handlePointerMove as any);
    window.addEventListener('pointerup', handlePointerUp as any);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown as any);
      window.removeEventListener('pointermove', handlePointerMove as any);
      window.removeEventListener('pointerup', handlePointerUp as any);
    };
  }, [isTablet]);

  return {
    isDrawing: isDrawing.current,
  };
}

// ========================================
// 悬浮窗口管理
// ========================================

export interface FloatingWindow {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: React.ReactNode;
  zIndex: number;
}

export function useFloatingWindows() {
  const { isTablet } = useResponsive();
  const windows = useRef<FloatingWindow[]>([]);
  const nextZIndex = useRef(100);

  const createWindow = (window: Omit<FloatingWindow, 'zIndex'>) => {
    if (!isTablet) return null;

    const newWindow: FloatingWindow = {
      ...window,
      zIndex: nextZIndex.current++,
    };

    windows.current.push(newWindow);
    return newWindow.id;
  };

  const closeWindow = (id: string) => {
    windows.current = windows.current.filter(w => w.id !== id);
  };

  const focusWindow = (id: string) => {
    const window = windows.current.find(w => w.id === id);
    if (window) {
      window.zIndex = nextZIndex.current++;
    }
  };

  const moveWindow = (id: string, x: number, y: number) => {
    const window = windows.current.find(w => w.id === id);
    if (window) {
      window.x = x;
      window.y = y;
    }
  };

  const resizeWindow = (id: string, width: number, height: number) => {
    const window = windows.current.find(w => w.id === id);
    if (window) {
      window.width = width;
      window.height = height;
    }
  };

  return {
    windows: windows.current,
    createWindow,
    closeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
  };
}

// ========================================
// 分屏模式
// ========================================

export type SplitScreenMode = 'single' | 'split-horizontal' | 'split-vertical';

export function useSplitScreen() {
  const { isTablet, isLandscape } = useResponsive();
  const mode = useRef<SplitScreenMode>('single');

  const enableSplitScreen = (newMode: SplitScreenMode) => {
    if (!isTablet) return false;
    
    // 横屏时才允许分屏
    if (!isLandscape && newMode !== 'single') {
      return false;
    }

    mode.current = newMode;
    return true;
  };

  const getSplitScreenClasses = () => {
    if (!isTablet || mode.current === 'single') {
      return 'w-full h-full';
    }

    if (mode.current === 'split-horizontal') {
      return 'w-1/2 h-full';
    }

    if (mode.current === 'split-vertical') {
      return 'w-full h-1/2';
    }

    return 'w-full h-full';
  };

  return {
    mode: mode.current,
    enableSplitScreen,
    getSplitScreenClasses,
    isSplitScreenAvailable: isTablet && isLandscape,
  };
}

// ========================================
// 键盘快捷键（平板外接键盘）
// ========================================

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const { isTablet } = useResponsive();

  useEffect(() => {
    if (!isTablet) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault();
          shortcut.callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, isTablet]);
}

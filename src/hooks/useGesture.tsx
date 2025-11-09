/**
 * 手势识别 Hook
 * 支持滑动、长按、双击等移动端/平板端手势
 */

import { useRef, useEffect, TouchEvent, MouseEvent } from 'react';

// 手势类型
export type GestureType = 'swipe-left' | 'swipe-right' | 'swipe-up' | 'swipe-down' | 'long-press' | 'double-tap';

// 手势回调
export interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

// 手势配置
export interface GestureConfig {
  swipeThreshold?: number;      // 滑动距离阈值 (px)
  longPressDelay?: number;       // 长按延迟 (ms)
  doubleTapDelay?: number;       // 双击间隔 (ms)
  preventScroll?: boolean;       // 是否阻止滚动
  enabled?: boolean;             // 是否启用手势
}

const defaultConfig: Required<GestureConfig> = {
  swipeThreshold: 50,
  longPressDelay: 500,
  doubleTapDelay: 300,
  preventScroll: false,
  enabled: true,
};

export function useGesture(callbacks: GestureCallbacks, config: GestureConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const lastTapTime = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isSwiping = useRef(false);

  // 清理长按定时器
  const clearLongPressTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // 触摸开始
  const handleTouchStart = (e: TouchEvent) => {
    if (!finalConfig.enabled) return;

    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchStartTime.current = Date.now();
    isSwiping.current = false;

    callbacks.onSwipeStart?.();

    // 设置长按定时器
    if (callbacks.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        callbacks.onLongPress?.();
      }, finalConfig.longPressDelay);
    }

    // 检测双击
    if (callbacks.onDoubleTap) {
      const now = Date.now();
      if (now - lastTapTime.current < finalConfig.doubleTapDelay) {
        callbacks.onDoubleTap();
        lastTapTime.current = 0; // 重置，避免三击
      } else {
        lastTapTime.current = now;
      }
    }
  };

  // 触摸移动
  const handleTouchMove = (e: TouchEvent) => {
    if (!finalConfig.enabled) return;

    // 如果开始移动，取消长按
    clearLongPressTimer();

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // 如果移动距离足够大，标记为滑动
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      isSwiping.current = true;
    }

    // 阻止滚动（如果配置启用）
    if (finalConfig.preventScroll && isSwiping.current) {
      e.preventDefault();
    }
  };

  // 触摸结束
  const handleTouchEnd = (e: TouchEvent) => {
    if (!finalConfig.enabled) return;

    clearLongPressTimer();

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    const deltaTime = Date.now() - touchStartTime.current;

    callbacks.onSwipeEnd?.();

    // 快速滑动检测（时间 < 300ms）
    const isFastSwipe = deltaTime < 300;

    // 水平滑动
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > finalConfig.swipeThreshold) {
        if (deltaX > 0) {
          callbacks.onSwipeRight?.();
        } else {
          callbacks.onSwipeLeft?.();
        }
      }
    }
    // 垂直滑动
    else {
      if (Math.abs(deltaY) > finalConfig.swipeThreshold) {
        if (deltaY > 0) {
          callbacks.onSwipeDown?.();
        } else {
          callbacks.onSwipeUp?.();
        }
      }
    }

    isSwiping.current = false;
  };

  // 清理
  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// ========================================
// 下拉刷新 Hook
// ========================================

export interface PullToRefreshCallbacks {
  onRefresh: () => void | Promise<void>;
}

export function usePullToRefresh(callbacks: PullToRefreshCallbacks) {
  const startY = useRef(0);
  const isPulling = useRef(false);
  const pullDistance = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    // 只在页面顶部时启用
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling.current) return;

    const currentY = e.touches[0].clientY;
    pullDistance.current = Math.max(0, currentY - startY.current);

    // 如果下拉距离足够，触发刷新
    if (pullDistance.current > 80) {
      // 可以在这里添加视觉反馈
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling.current) return;

    if (pullDistance.current > 80) {
      await callbacks.onRefresh();
    }

    isPulling.current = false;
    pullDistance.current = 0;
    startY.current = 0;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    pullDistance: pullDistance.current,
  };
}

// ========================================
// 滑动删除 Hook
// ========================================

export interface SwipeToDeleteCallbacks {
  onDelete: () => void;
  onArchive?: () => void;
}

export function useSwipeToDelete(callbacks: SwipeToDeleteCallbacks) {
  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping.current) return;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;

    const deltaX = currentX.current - startX.current;

    // 向左滑动超过 100px - 删除
    if (deltaX < -100) {
      callbacks.onDelete();
    }
    // 向右滑动超过 100px - 归档
    else if (deltaX > 100 && callbacks.onArchive) {
      callbacks.onArchive();
    }

    isSwiping.current = false;
    startX.current = 0;
    currentX.current = 0;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    swipeDistance: currentX.current - startX.current,
  };
}

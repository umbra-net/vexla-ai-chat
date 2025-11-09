import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export type VoiceAnimationMode = 
  | 'awakening'   // 唤醒模式 (1秒)
  | 'listening'   // 收听模式
  | 'processing'; // 处理模式

interface VoiceWaveformProps {
  mode: VoiceAnimationMode;
  barCount?: number;
  isActive: boolean;
}

export function VoiceWaveform({ mode, barCount = 40, isActive }: VoiceWaveformProps) {
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(barCount).fill(0));

  useEffect(() => {
    if (!isActive) {
      setAudioLevels(Array(barCount).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setAudioLevels(prev => {
        switch (mode) {
          case 'awakening':
            // 唤醒模式：从中心扩散，轻微波动
            return prev.map((_, i) => {
              const centerDist = Math.abs(i - barCount / 2);
              const baseHeight = Math.max(0, 40 - centerDist * 2);
              return baseHeight + Math.random() * 15;
            });
          
          case 'listening':
            // 收听模式：实时音频响应，剧烈波动
            return prev.map(() => Math.random() * 100);
          
          case 'processing':
            // 处理模式：波浪涟漪效果
            return prev.map((_, i) => {
              const wave = Math.sin((i / barCount) * Math.PI * 2 + Date.now() / 200) * 30 + 35;
              return Math.max(10, wave);
            });
          
          default:
            return prev.map(() => Math.random() * 50);
        }
      });
    }, mode === 'listening' ? 50 : 100); // 收听模式更新更频繁

    return () => clearInterval(interval);
  }, [mode, barCount, isActive]);

  // 根据模式获取颜色
  const getBarColor = (index: number, level: number) => {
    const progress = index / barCount;
    
    switch (mode) {
      case 'awakening':
        // 蓝紫粉渐变
        const hueAwake = 200 + progress * 80; // 200-280 (蓝到紫到粉)
        return `linear-gradient(to top, 
          hsl(${hueAwake}, 100%, 60%), 
          hsl(${hueAwake + 20}, 100%, 70%)
        )`;
      
      case 'listening':
        // 彩虹渐变
        const hueRainbow = progress * 360;
        return `linear-gradient(to top, 
          hsl(${hueRainbow}, 100%, 50%), 
          hsl(${(hueRainbow + 60) % 360}, 100%, 60%)
        )`;
      
      case 'processing':
        // 蓝青渐变
        const hueProcess = 180 + progress * 40; // 180-220 (青到蓝)
        return `linear-gradient(to top, 
          hsl(${hueProcess}, 80%, 55%), 
          hsl(${hueProcess + 15}, 80%, 65%)
        )`;
      
      default:
        return 'linear-gradient(to top, #3b82f6, #60a5fa)';
    }
  };

  // 根据模式获取光晕颜色
  const getGlowColor = (index: number) => {
    const progress = index / barCount;
    
    switch (mode) {
      case 'awakening':
        const hueAwake = 200 + progress * 80;
        return `hsl(${hueAwake}, 100%, 60%)`;
      
      case 'listening':
        const hueRainbow = progress * 360;
        return `hsl(${hueRainbow}, 100%, 50%)`;
      
      case 'processing':
        const hueProcess = 180 + progress * 40;
        return `hsl(${hueProcess}, 80%, 55%)`;
      
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="absolute inset-0 flex items-end justify-center gap-0.5 px-3 pb-3">
      {audioLevels.map((level, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: `${Math.max(8, level * 0.6)}%`,
            background: getBarColor(i, level),
            boxShadow: `0 0 ${level / 15}px ${getGlowColor(i)}`,
            filter: level > 80 ? 'blur(0.5px)' : 'none',
          }}
          animate={{
            height: `${Math.max(8, level * 0.6)}%`,
          }}
          transition={{
            duration: mode === 'listening' ? 0.05 : 0.1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

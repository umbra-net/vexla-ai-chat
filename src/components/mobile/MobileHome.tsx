import { motion } from 'motion/react';
import { Bot, Image, Code, Heart, FileText, Lightbulb, Palette, Zap } from 'lucide-react';
import { AIFeatureCard } from '../AIFeatureCard';
import { CategoryFilter } from '../CategoryFilter';
import { IslandMessageType } from '../EnhancedDynamicIsland';
import { useResponsive } from '../../hooks/useResponsive';

interface MobileHomeProps {
  selectedCategory: string;
  categories: string[];
  onSelectCategory: (category: string) => void;
  onFeatureClick: (featureName: string, type: IslandMessageType) => void;
  onStartChat: () => void;
}

export function MobileHome({
  selectedCategory,
  categories,
  onSelectCategory,
  onFeatureClick,
  onStartChat,
}: MobileHomeProps) {
  const { deviceType, isTablet } = useResponsive();
  
  // 根据设备类型动态调整内边距和间距
  const getPadding = () => {
    if (deviceType === 'tablet' || deviceType === 'tablet-large') {
      return 'px-8'; // 平板更大的内边距
    }
    if (deviceType === 'mobile-small') {
      return 'px-4'; // 小屏手机更小的内边距
    }
    return 'px-6'; // 标准手机
  };
  
  const getGridGap = () => {
    if (deviceType === 'tablet' || deviceType === 'tablet-large') {
      return 'gap-4'; // 平板更大的间距
    }
    if (deviceType === 'mobile-small') {
      return 'gap-2'; // 小屏手机更小的间距
    }
    return 'gap-3'; // 标准手机
  };
  
  const getGridCols = () => {
    // 平板横屏时显示3列，否则2列
    if (isTablet) {
      return 'grid-cols-2 sm:grid-cols-3';
    }
    return 'grid-cols-2';
  };
  
  const padding = getPadding();
  const gridGap = getGridGap();
  const gridCols = getGridCols();
  
  return (
    <div className="flex flex-col min-h-full bg-transparent relative">
      {/* Header - Fixed with gradient fade */}
      <div className={`sticky top-0 z-20 ${padding} pt-4 pb-4 bg-gradient-to-b from-[#0a0e27]/95 via-[#0a0e27]/85 to-[#0a0e27]/70 backdrop-blur-2xl border-b border-white/5`}>
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* AI Feature Cards Grid with gradient mask at top */}
      <div className={`flex-1 overflow-y-auto ${padding} relative`}>
        {/* Gradient Mask at top for smooth scroll fade - creates seamless blend */}
        <div className="sticky top-0 h-12 bg-gradient-to-b from-[#0a0e27]/90 via-[#0a0e27]/70 to-transparent z-10 pointer-events-none -mb-8" />
        
        <div className={`grid ${gridCols} ${gridGap} pt-4 pb-4 relative z-0`}>
          {/* Assistant Card - Large */}
          <AIFeatureCard
            icon={Bot}
            title="Assistant"
            description="Chat & get help"
            gradient="bg-gradient-to-br from-blue-500/30 via-blue-600/20 to-purple-600/30"
            size="large"
            onClick={onStartChat}
            badge="Active"
            recentActivity="2m ago"
          />

          {/* Image Generation Card */}
          <AIFeatureCard
            icon={Image}
            title="Image Studio"
            gradient="bg-gradient-to-br from-pink-500/30 via-purple-500/20 to-orange-500/30"
            size="medium"
            onClick={() => onFeatureClick('Image Studio', 'image')}
            recentActivity="1h ago"
          />

          {/* Code Assistant Card */}
          <AIFeatureCard
            icon={Code}
            title="Code Helper"
            gradient="bg-gradient-to-br from-green-500/30 via-emerald-600/20 to-teal-600/30"
            size="small"
            onClick={() => onFeatureClick('Code Helper', 'code')}
          />

          {/* Therapist/Wellness Card with items */}
          <AIFeatureCard
            icon={Heart}
            title="Wellness"
            gradient="bg-gradient-to-br from-rose-500/30 via-pink-600/20 to-purple-600/30"
            size="medium"
            onClick={() => onFeatureClick('Wellness', 'chat')}
            items={["Mood check", "Meditation"]}
          />

          {/* Writing Assistant */}
          <AIFeatureCard
            icon={FileText}
            title="Writing"
            gradient="bg-gradient-to-br from-indigo-500/30 via-blue-600/20 to-cyan-600/30"
            size="small"
            onClick={() => onFeatureClick('Writing Assistant', 'chat')}
          />

          {/* Ideas & Brainstorm */}
          <AIFeatureCard
            icon={Lightbulb}
            title="Ideas"
            description="Generate ideas"
            gradient="bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-yellow-500/30"
            size="medium"
            onClick={onStartChat}
          />

          {/* Quick Actions */}
          <AIFeatureCard
            icon={Zap}
            title="Quick AI"
            gradient="bg-gradient-to-br from-violet-500/30 via-purple-600/20 to-fuchsia-600/30"
            size="small"
            onClick={onStartChat}
            badge="New"
          />

          {/* Design Sprint - Large with gradient like reference */}
          <AIFeatureCard
            icon={Palette}
            title="Design Sprint"
            description="Creative tools"
            gradient="bg-gradient-to-br from-cyan-300/40 via-pink-300/30 to-purple-300/40"
            size="large"
            onClick={onStartChat}
            recentActivity="2h ago"
          />
        </div>
      </div>
    </div>
  );
}

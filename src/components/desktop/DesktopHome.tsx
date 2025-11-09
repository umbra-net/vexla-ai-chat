import { motion } from 'motion/react';
import { Bot, Image, Code, Heart, FileText, Lightbulb, Palette, Zap, Sparkles } from 'lucide-react';
import { IslandMessageType } from '../EnhancedDynamicIsland';

interface DesktopHomeProps {
  onFeatureClick: (featureName: string, type: IslandMessageType) => void;
  onStartChat: () => void;
}

export function DesktopHome({ onFeatureClick, onStartChat }: DesktopHomeProps) {
  const features = [
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Chat and get intelligent help with any task',
      gradient: 'from-blue-500/20 via-blue-600/10 to-purple-600/20',
      size: 'large',
      type: 'chat' as IslandMessageType,
    },
    {
      icon: Image,
      title: 'Image Studio',
      description: 'Generate and edit stunning images',
      gradient: 'from-pink-500/20 via-purple-500/10 to-orange-500/20',
      size: 'medium',
      type: 'image' as IslandMessageType,
    },
    {
      icon: Code,
      title: 'Code Helper',
      description: 'Debug, write, and optimize code',
      gradient: 'from-green-500/20 via-emerald-600/10 to-teal-600/20',
      size: 'medium',
      type: 'code' as IslandMessageType,
    },
    {
      icon: Heart,
      title: 'Wellness Coach',
      description: 'Mental health and meditation support',
      gradient: 'from-rose-500/20 via-pink-600/10 to-purple-600/20',
      size: 'medium',
      type: 'chat' as IslandMessageType,
    },
    {
      icon: FileText,
      title: 'Writing Assistant',
      description: 'Create compelling content',
      gradient: 'from-indigo-500/20 via-blue-600/10 to-cyan-600/20',
      size: 'medium',
      type: 'chat' as IslandMessageType,
    },
    {
      icon: Lightbulb,
      title: 'Idea Generator',
      description: 'Brainstorm and innovate',
      gradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
      size: 'medium',
      type: 'chat' as IslandMessageType,
    },
    {
      icon: Palette,
      title: 'Design Sprint',
      description: 'Creative design tools and workflows',
      gradient: 'from-cyan-300/30 via-pink-300/20 to-purple-300/30',
      size: 'large',
      type: 'chat' as IslandMessageType,
    },
    {
      icon: Zap,
      title: 'Quick AI',
      description: 'Instant AI responses',
      gradient: 'from-violet-500/20 via-purple-600/10 to-fuchsia-600/20',
      size: 'medium',
      type: 'chat' as IslandMessageType,
    },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h1 className="text-white/90 text-4xl">Welcome to Vexla Umbric</h1>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-white/60 text-lg">Choose a mode to get started with your AI-powered workspace</p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.button
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onFeatureClick(feature.title, feature.type)}
              className={`relative group rounded-2xl p-6 bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all ${
                feature.size === 'large' ? 'col-span-2 row-span-2' : ''
              }`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} border border-white/20 flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-white/90 text-xl mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
                
                {feature.size === 'large' && (
                  <div className="mt-auto pt-6">
                    <div className="inline-flex items-center gap-2 text-white/60 text-sm group-hover:text-white/90 transition-colors">
                      <span>Get started</span>
                      <motion.span
                        initial={{ x: 0 }}
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: 10000, repeatType: "loop" }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-6"
        >
          {[
            { label: 'Conversations', value: '248' },
            { label: 'Artifacts Created', value: '64' },
            { label: 'Time Saved', value: '12h' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10"
            >
              <p className="text-white/40 text-sm mb-1">{stat.label}</p>
              <p className="text-white/90 text-2xl">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

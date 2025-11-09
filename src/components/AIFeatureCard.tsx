import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface AIFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  gradient: string;
  size?: 'small' | 'medium' | 'large';
  onClick: () => void;
  badge?: string;
  hasImage?: boolean;
  imageUrl?: string;
  recentActivity?: string;
  items?: string[];
}

export function AIFeatureCard({ 
  icon: Icon, 
  title, 
  description,
  gradient,
  size = 'medium',
  onClick,
  badge,
  hasImage,
  imageUrl,
  recentActivity,
  items
}: AIFeatureCardProps) {
  
  const sizeClasses = {
    small: 'col-span-1 h-36',
    medium: 'col-span-1 h-52',
    large: 'col-span-2 h-52'
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative ${sizeClasses[size]} rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300`}
    >
      {/* Background */}
      <div className={`absolute inset-0 ${gradient} backdrop-blur-xl`}>
        {hasImage && imageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
      </div>

      {/* Glassmorphism overlay with enhanced gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl"></div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative h-full p-5 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-lg ${
            size === 'large' ? 'group-hover:scale-110' : 'group-hover:scale-105'
          } transition-transform duration-300`}>
            {/* Inner highlight */}
            <div className="absolute inset-x-2 top-1 h-1/3 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
            <Icon className="w-6 h-6 text-white relative z-10" strokeWidth={1.5} />
          </div>
          
          {badge && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-xl border border-white/30 shadow-md"
            >
              <span className="text-white/90 text-xs font-medium">{badge}</span>
            </motion.div>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex-1 flex flex-col justify-end text-left">
          {items && items.length > 0 && (
            <div className="mb-4 space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20">
                  <div className="w-4 h-4 rounded-full border-2 border-white/60"></div>
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
          )}
          
          <h3 className="text-white text-xl mb-1 tracking-tight">{title}</h3>
          
          {description && (
            <p className="text-white/70 text-sm">{description}</p>
          )}
          
          {recentActivity && (
            <p className="text-white/50 text-xs mt-2">{recentActivity}</p>
          )}
        </div>

        {/* Decorative gradient orb */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
      </div>
    </motion.button>
  );
}

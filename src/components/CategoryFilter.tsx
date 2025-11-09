import { motion } from 'motion/react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category;
        
        return (
          <motion.button
            key={category}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(category)}
            className={`relative px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-r from-white/20 via-white/25 to-white/20 backdrop-blur-xl border border-white/30 shadow-[0_4px_16px_rgba(255,255,255,0.1)]'
                : 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/12 hover:border-white/20'
            }`}
          >
            {/* Badge indicator for first category when selected */}
            {index === 0 && isSelected && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg"
              >
                <span className="text-white text-xs font-medium">8</span>
              </motion.div>
            )}
            
            {/* Active indicator glow */}
            {isSelected && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-sm -z-10" />
            )}
            
            <span className={`${
              isSelected ? 'text-white font-medium' : 'text-white/60'
            } text-sm transition-all duration-300`}>
              {category}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

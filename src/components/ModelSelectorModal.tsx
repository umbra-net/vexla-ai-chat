import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Zap, Brain, Check } from 'lucide-react';
import { Button } from './ui/button';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const MODELS = [
  {
    id: 'vexla-ultra',
    name: 'Vexla Ultra',
    description: 'Most capable model with advanced reasoning',
    icon: Sparkles,
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: 'vexla-max',
    name: 'Vexla Max',
    description: 'Fast and efficient for most tasks',
    icon: Zap,
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'vexla-pro',
    name: 'Vexla Pro',
    description: 'Balanced performance',
    icon: Brain,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'vexla',
    name: 'Vexla',
    description: 'Quick responses for simple queries',
    icon: Brain,
    color: 'from-pink-500 to-orange-500'
  }
];

export function ModelSelectorModal({ isOpen, onClose, selectedModel, onSelectModel }: ModelSelectorModalProps) {
  const handleSelectModel = (modelId: string) => {
    onSelectModel(modelId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1100] w-full max-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-[24px] bg-gradient-to-b from-[#0a0e27]/95 via-[#1a1f3a]/90 to-[#0f1428]/95 border border-white/20">
              {/* Header - Minimal */}
              <div className="absolute top-0 right-0 p-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-9 w-9 rounded-full hover:bg-white/10 transition-all hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                >
                  <X className="w-5 h-5 text-white/70" />
                </Button>
              </div>

              {/* Models List */}
              <div className="p-6 pt-16 space-y-3">
                {MODELS.map((model) => {
                  const Icon = model.icon;
                  const isSelected = selectedModel === model.id;
                  
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleSelectModel(model.id)}
                      className={`relative w-full p-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden group ${
                        isSelected
                          ? 'bg-white/15 border-blue-400/50 shadow-[0_0_24px_rgba(59,130,246,0.3)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white">{model.name}</h3>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-white/60 mt-1">{model.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

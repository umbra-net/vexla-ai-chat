import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, Lock, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Button } from './ui/button';

interface BrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

export function BrowserModal({ isOpen, onClose, url = 'https://example.com' }: BrowserModalProps) {
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1200]"
            onClick={onClose}
          />

          {/* Browser Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.25, 
              ease: [0.25, 0.8, 0.25, 1]
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1200] w-full max-w-[400px] h-[85vh] max-h-[750px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-[24px] bg-gradient-to-b from-white/10 via-white/5 to-white/10 border border-white/20 flex flex-col relative">
              {/* Address Bar - Compact with transparent background */}
              <div className="px-4 py-3 bg-transparent">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/10 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-white/70" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/10 transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-white/70" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/10 transition-all"
                  >
                    <RefreshCw className="w-4 h-4 text-white/70" />
                  </Button>
                  <div className="flex-1 h-9 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 px-3 flex items-center gap-2 hover:bg-white/10 transition-all">
                    <Lock className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-white/60 truncate">{url}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full hover:bg-white/10 transition-all"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </Button>
                </div>
              </div>

              {/* Browser Content Area */}
              <div className="flex-1 overflow-hidden bg-gradient-to-b from-white/5 to-transparent">
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    {/* Placeholder Icon */}
                    <div className="mx-auto w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-pink-500/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 animate-pulse"></div>
                      <div className="relative z-10">
                        <Home className="w-14 h-14 text-blue-300/90 drop-shadow-[0_0_12px_rgba(147,197,253,0.5)]" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* Text */}
                    <div className="space-y-2">
                      <h3 className="text-white/90 text-lg">Browser Preview</h3>
                      <p className="text-white/60 text-sm max-w-xs">
                        Browser interface ready. Real webpage loading will be available in future updates.
                      </p>
                    </div>

                    {/* Loading indicator placeholder */}
                    <div className="flex justify-center gap-1 pt-4">
                      <div className="w-2 h-2 rounded-full bg-blue-400/60 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400/60 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-pink-400/60 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Status Bar (Future Extension) */}
              <div className="px-4 py-3 bg-white/5 backdrop-blur-xl border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs text-white/60">Ready</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white/10 transition-all hover:shadow-[0_0_12px_rgba(147,197,253,0.3)]"
                    >
                      <Home className="w-3.5 h-3.5 text-white/60" />
                    </Button>
                  </div>
                  <span className="text-xs text-white/40">v1.0.0</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

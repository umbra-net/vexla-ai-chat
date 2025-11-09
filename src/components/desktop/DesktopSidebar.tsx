import { motion, AnimatePresence } from 'motion/react';
import { Bot, MessageSquare, Plus, Settings, History, Sparkles, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DesktopSidebarProps {
  currentView: 'home' | 'chat';
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export function DesktopSidebar({ currentView, onNewChat, onOpenSettings }: DesktopSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Mock chat history
  const chatHistory = [
    { id: '1', title: 'Image generation help', time: '2m ago', isActive: currentView === 'chat' },
    { id: '2', title: 'Code debugging assistance', time: '1h ago', isActive: false },
    { id: '3', title: 'Creative writing ideas', time: '3h ago', isActive: false },
    { id: '4', title: 'Data analysis task', time: '1d ago', isActive: false },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-full bg-gradient-to-b from-[#0a0e27]/95 via-[#1a1f3a]/90 to-[#0f1428]/95 backdrop-blur-xl border-r border-white/10 flex flex-col relative z-20"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-white/90">Vexla Umbric</h2>
                <p className="text-white/40 text-xs">AI Assistant</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 border border-white/20 flex items-center justify-center gap-2 transition-all group"
        >
          <Plus className="w-5 h-5 text-white/90 group-hover:rotate-90 transition-transform duration-300" />
          {isExpanded && (
            <span className="text-white/90">New Chat</span>
          )}
        </motion.button>
      </div>

      {/* Chat History */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-white/40" />
            <span className="text-white/60 text-sm">Recent</span>
          </div>
          
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {chatHistory.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative p-3 rounded-lg transition-all cursor-pointer ${
                    chat.isActive
                      ? 'bg-white/10 border border-white/20'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm line-clamp-2">{chat.title}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-white/40" />
                        <span className="text-white/40 text-xs">{chat.time}</span>
                      </div>
                    </div>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded bg-white/5 hover:bg-red-500/20 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                    >
                      <Trash2 className="w-3 h-3 text-white/60" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenSettings}
          className="w-full h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center gap-3 px-3 transition-colors group"
        >
          <Settings className="w-4 h-4 text-white/70 group-hover:rotate-90 transition-transform duration-300" />
          {isExpanded && (
            <span className="text-white/80 text-sm">Settings</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

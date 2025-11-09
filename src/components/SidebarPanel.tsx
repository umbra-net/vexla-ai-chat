import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Settings, MessageSquare, CheckSquare, Clock, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface SidebarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
}

export function SidebarPanel({ isOpen, onClose, onNewChat, onOpenSettings }: SidebarPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const recentChats = [
    { id: 1, title: 'Weather forecast for tomorrow', time: '2m ago', icon: MessageSquare },
    { id: 2, title: 'Help with React code', time: '1h ago', icon: MessageSquare },
    { id: 3, title: 'Recipe for pasta carbonara', time: '3h ago', icon: MessageSquare },
    { id: 4, title: 'Travel tips for Japan', time: '1d ago', icon: MessageSquare },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1400]"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
            className="fixed left-0 top-0 bottom-0 w-80 z-[1400] bg-gradient-to-b from-[#0a0e27]/98 via-[#1a1f3a]/95 to-[#0f1428]/98 backdrop-blur-2xl border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Search Bar */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-blue-400/40 transition-all duration-200"
                  />
                </div>
              </div>

              {/* New Chat & Task Buttons */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    onNewChat();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-98 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">New Chat</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-98 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <CheckSquare className="w-4 h-4 text-white/70" />
                  </div>
                  <span className="text-white/80">New Task</span>
                </button>
              </div>

              {/* Recent Chats */}
              <div className="flex-1 overflow-y-auto px-4 py-2">
                <h3 className="text-xs uppercase tracking-wider text-white/40 mb-3 px-2">Recent</h3>
                <div className="space-y-1">
                  {recentChats.map((chat) => {
                    const Icon = chat.icon;
                    return (
                      <div
                        key={chat.id}
                        className="w-full group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all duration-200 relative"
                      >
                        <button
                          onClick={onClose}
                          className="absolute inset-0 rounded-lg"
                          aria-label={`Open chat: ${chat.title}`}
                        />
                        <Icon className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0 group-hover:text-blue-400 transition-colors relative z-10 pointer-events-none" />
                        <div className="flex-1 text-left min-w-0 relative z-10 pointer-events-none">
                          <p className="text-sm text-white/80 truncate group-hover:text-white transition-colors">
                            {chat.title}
                          </p>
                          <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {chat.time}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-500/20 rounded relative z-10"
                          aria-label="Delete chat"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Settings Button at Bottom */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onOpenSettings();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-98 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                    <Settings className="w-4 h-4 text-white/70" />
                  </div>
                  <span className="text-white/80">Settings</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

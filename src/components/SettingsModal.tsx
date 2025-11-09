import { motion, AnimatePresence } from 'motion/react';
import { X, User, Palette, Bell, Shield, Zap, Globe, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const settingsSections = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Dark Mode', type: 'toggle', value: isDarkMode, onChange: setIsDarkMode },
        { label: 'Theme', type: 'select', value: 'Blue Gradient' }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Enable Notifications', type: 'toggle', value: notifications, onChange: setNotifications },
        { label: 'Sound Effects', type: 'toggle', value: true }
      ]
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        { label: 'Data Collection', type: 'toggle', value: false },
        { label: 'Analytics', type: 'toggle', value: false }
      ]
    }
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
            transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1300]"
            onClick={onClose}
          />

          {/* Settings Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1300] w-full max-w-[400px] max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-[24px] bg-gradient-to-b from-[#0a0e27]/95 via-[#1a1f3a]/90 to-[#0f1428]/95 border border-white/20 flex flex-col">
              {/* Header - Minimal with icon only */}
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

              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh] p-6 pt-16">
                <div className="space-y-6">
                  {settingsSections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center gap-2 text-white/80">
                        <section.icon className="w-4 h-4" />
                        <h3 className="text-sm uppercase tracking-wider">{section.title}</h3>
                      </div>
                      <div className="space-y-2">
                        {section.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                          >
                            <span className="text-white/90">{item.label}</span>
                            {item.type === 'toggle' && (
                              <button
                                onClick={() => item.onChange && item.onChange(!item.value)}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  item.value
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                    : 'bg-white/20'
                                }`}
                              >
                                <div
                                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                                    item.value ? 'translate-x-6' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            )}
                            {item.type === 'select' && (
                              <span className="text-blue-400 text-sm">{item.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl">
                <Button
                  onClick={onClose}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-[0_0_24px_rgba(147,197,253,0.4)] transition-all"
                >
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

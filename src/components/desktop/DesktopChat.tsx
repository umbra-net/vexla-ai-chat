import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';
import { ChatMessage } from '../ChatMessage';
import { TypingIndicator } from '../TypingIndicator';
import { ImageGenerationCard } from '../ImageGenerationCard';
import { EnhancedArtifactPreview } from '../EnhancedArtifactPreview';
import { WeatherCard } from '../WeatherCard';
import { LANDSCAPE_IMAGES } from '../../constants';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  hasImage?: boolean;
  artifactId?: string;
}

interface Artifact {
  id: string;
  type: string;
  title: string;
}

interface DesktopChatProps {
  messages: Message[];
  artifacts: Artifact[];
  isTyping: boolean;
  showWeatherCard?: boolean;
  onSendMessage: (text: string) => void;
  onViewArtifact: (artifactId: string) => void;
}

export function DesktopChat({ 
  messages, 
  artifacts, 
  isTyping, 
  showWeatherCard = false,
  onSendMessage, 
  onViewArtifact
}: DesktopChatProps) {

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-xl"
                >
                  <Sparkles className="w-10 h-10 text-white/70" />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/90 text-2xl mb-3"
                >
                  Start a conversation
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/60 text-lg"
                >
                  Ask me anything or choose a mode from the home screen
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {messages.map((message, index) => (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ChatMessage
                      message={message.text}
                      isUser={message.isUser}
                    />
                    
                    {/* Image Generation Card */}
                    {message.hasImage && !message.isUser && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                      >
                        <ImageGenerationCard
                          mainImage={LANDSCAPE_IMAGES[0]}
                          thumbnails={LANDSCAPE_IMAGES}
                        />
                      </motion.div>
                    )}
                    
                    {/* Artifact Preview - Enhanced Version */}
                    {message.artifactId && !message.isUser && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                      >
                        <EnhancedArtifactPreview
                          artifact={artifacts.find(a => a.id === message.artifactId)!}
                          onClick={() => onViewArtifact(message.artifactId!)}
                        />
                      </motion.div>
                    )}
                    
                    {/* Weather Card */}
                    {showWeatherCard && !message.isUser && message.text.toLowerCase().includes('weather') && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4"
                      >
                        <WeatherCard />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: 10000,
                        repeatType: "loop",
                        ease: "easeInOut"
                      }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center border border-white/20"
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </motion.div>
                    <TypingIndicator />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 
        注意: 桌面端的输入功能已统一到 FloatingActionButtons 组件
        - 紧凑模式: 右下角快捷按钮
        - 扩展模式: 底部中心完整输入框
        - 详见: /FINAL_UI_OPTIMIZATION_PLAN.md
      */}
    </div>
  );
}

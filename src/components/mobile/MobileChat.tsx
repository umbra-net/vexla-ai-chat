import { MobileChatMessage } from '../MobileChatMessage';
import { TypingIndicator } from '../TypingIndicator';
import { ImageGenerationCard } from '../ImageGenerationCard';
import { EnhancedArtifactPreview } from '../EnhancedArtifactPreview';
import { Layers } from 'lucide-react';
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

interface MobileChatProps {
  messages: Message[];
  artifacts: Artifact[];
  isTyping: boolean;
  showWeatherCard: boolean;
  onViewArtifact: (artifactId: string) => void;
}

export function MobileChat({
  messages,
  artifacts,
  isTyping,
  showWeatherCard,
  onViewArtifact,
}: MobileChatProps) {
  return (
    <div className="pb-4">
      {/* Artifacts indicator */}
      {artifacts.length > 0 && (
        <div className="px-6 mb-3">
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="text-white/80 text-sm">
              {artifacts.length}
            </span>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div key={message.id}>
          <MobileChatMessage
            message={message.text}
            isUser={message.isUser}
            hasImage={message.hasImage}
            artifactId={message.artifactId}
            onViewArtifact={onViewArtifact}
          />
          
          {/* 图片生成卡片 - 修复：移动端现在也显示图片 */}
          {message.hasImage && !message.isUser && (
            <div className="px-6 mt-3 mb-4">
              <ImageGenerationCard
                mainImage={LANDSCAPE_IMAGES[0]}
                thumbnails={LANDSCAPE_IMAGES}
              />
            </div>
          )}
          
          {/* Artifact 预览 - Enhanced Version */}
          {message.artifactId && !message.isUser && (
            <div className="px-6 mt-3 mb-4">
              <EnhancedArtifactPreview
                artifact={artifacts.find(a => a.id === message.artifactId)!}
                onClick={() => onViewArtifact(message.artifactId!)}
              />
            </div>
          )}
          
          {/* 天气卡片 */}
          {showWeatherCard && !message.isUser && message.text.includes('weather') && (
            <div className="px-6 mt-4 mb-6">
              <WeatherCard />
            </div>
          )}
        </div>
      ))}

      {isTyping && (
        <div className="px-6 mt-4">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}

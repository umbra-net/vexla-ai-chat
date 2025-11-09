import { Bot, User } from "lucide-react";

interface MobileChatMessageProps {
  message: string;
  isUser: boolean;
  hasImage?: boolean;
  artifactId?: string;
  onViewArtifact?: (artifactId: string) => void;
}

export function MobileChatMessage({ 
  message, 
  isUser, 
  hasImage, 
  artifactId, 
  onViewArtifact 
}: MobileChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-6 mb-3`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2.5 shadow-lg shadow-blue-500/30">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-3xl transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white/5 backdrop-blur-xl border border-white/10 text-white/95'
        }`}
      >
        {message}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center ml-2.5 shadow-lg shadow-pink-500/30">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

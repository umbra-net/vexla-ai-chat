import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
  hasImage?: boolean;
  artifactId?: string;
  onViewArtifact?: (artifactId: string) => void;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/30' 
          : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/30'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className={`rounded-2xl px-6 py-3 backdrop-blur-xl shadow-lg transition-all duration-300 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-blue-500/20' 
            : 'bg-white/60 text-gray-900 shadow-purple-500/10 border border-white/40'
        }`}>
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className={`text-xs mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser ? 'text-gray-600' : 'text-gray-500'
          }`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}

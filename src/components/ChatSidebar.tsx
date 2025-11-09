import { MessageSquare, Plus, Settings, Trash2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export function ChatSidebar({ 
  chatHistory, 
  activeChat, 
  onNewChat, 
  onSelectChat,
  onDeleteChat 
}: ChatSidebarProps) {
  return (
    <div className="w-80 h-full bg-white/40 backdrop-blur-xl border-r border-white/20 flex flex-col">
      {/* Header */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Chat
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/50"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Chat
        </Button>
      </div>

      <Separator className="bg-white/20" />

      {/* Chat History */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-2">
          <div className="px-3 py-2 text-xs text-gray-500 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Recent Conversations
          </div>
          
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`group relative rounded-xl p-3 cursor-pointer transition-all ${
                activeChat === chat.id
                  ? 'bg-white/60 shadow-lg shadow-purple-500/10'
                  : 'hover:bg-white/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-purple-500" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{chat.title}</p>
                  <p className="text-sm text-gray-500 truncate">{chat.preview}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {chat.timestamp.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

import { Mic, Volume2, MoreVertical, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface MobileBottomBarProps {
  onVoiceClick?: () => void;
  isRecording?: boolean;
}

export function MobileBottomBar({ onVoiceClick, isRecording }: MobileBottomBarProps) {
  return (
    <div className="px-8 py-4">
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={onVoiceClick}
          className={`relative h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            isRecording 
              ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-[0_0_40px_rgba(168,85,247,0.6)]' 
              : 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-[0_0_40px_rgba(59,130,246,0.6)]'
          }`}
        >
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-50 blur-xl animate-pulse"></div>
          
          <div className="relative w-full h-full rounded-full border-2 border-white/20 flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-inner">
              <div className="flex gap-0.5">
                <div className="w-1 h-5 bg-white/90 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]"></div>
                <div className="w-1 h-7 bg-white/90 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ animationDelay: '100ms' }}></div>
                <div className="w-1 h-9 bg-white rounded-full animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.8)]" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1 h-7 bg-white/90 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1 h-5 bg-white/90 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </button>
      </div>
    </div>
  );
}

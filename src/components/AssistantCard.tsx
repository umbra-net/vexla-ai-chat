import { LucideIcon } from "lucide-react";

interface AssistantCardProps {
  icon: LucideIcon;
  title: string;
  onClick: () => void;
}

export function AssistantCard({ icon: Icon, title, onClick }: AssistantCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative h-full group perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card with 3D transform */}
      <div className="relative h-full w-full transition-all duration-700 ease-out group-hover:scale-105 group-active:scale-95"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(2deg) rotateY(-2deg)'
        }}
      >
        {/* Outer glow layer */}
        <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        
        {/* Main card container */}
        <div className="relative h-full rounded-[2rem] overflow-hidden bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/10 group-hover:border-white/30 transition-all duration-700 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700"></div>
          
          {/* Diagonal shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
          
          {/* Motion blur effect on edges */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-500/10 to-transparent blur-sm"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-purple-500/10 to-transparent blur-sm"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-5">
            {/* Icon container with floating animation */}
            <div className="relative mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
              {/* Icon glow rings */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <div className="absolute -inset-2 rounded-full border-2 border-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-spin" style={{ animationDuration: '10s' }}></div>
              
              {/* Icon background */}
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_8px_32px_rgba(59,130,246,0.4)] group-hover:shadow-[0_12px_48px_rgba(59,130,246,0.6)] transition-all duration-500">
                <Icon className="w-8 h-8 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Title with gradient */}
            <p className="text-white text-center relative">
              <span className="opacity-90 group-hover:opacity-0 transition-opacity duration-300">{title}</span>
              <span className="absolute inset-0 text-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300">{title}</span>
            </p>
            
            {/* Decorative dots */}
            <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
              <div className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

import { motion } from 'motion/react';
import { Code, FileText, Image, ExternalLink, Copy, Check, Maximize2, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Artifact {
  id: string;
  type: string;
  title: string;
  content?: string;
  language?: string;
}

interface EnhancedArtifactPreviewProps {
  artifact: Artifact;
  onClick: () => void;
}

// 获取 Artifact 图标
const getArtifactIcon = (type: string) => {
  switch (type) {
    case 'code':
      return Code;
    case 'document':
      return FileText;
    case 'html':
      return Code;
    case 'image':
      return Image;
    default:
      return FileText;
  }
};

// 获取渐变色
const getGradient = (type: string) => {
  switch (type) {
    case 'code':
      return 'from-green-500/20 to-emerald-600/20';
    case 'document':
      return 'from-blue-500/20 to-cyan-600/20';
    case 'html':
      return 'from-orange-500/20 to-red-600/20';
    case 'image':
      return 'from-purple-500/20 to-pink-600/20';
    default:
      return 'from-gray-500/20 to-slate-600/20';
  }
};

// 获取内容预览（前3行）
const getContentPreview = (content: string | undefined, maxLines: number = 3): string => {
  if (!content) return 'Click to view content';
  const lines = content.split('\n').slice(0, maxLines);
  return lines.join('\n');
};

export function EnhancedArtifactPreview({ artifact, onClick }: EnhancedArtifactPreviewProps) {
  const [copied, setCopied] = useState(false);
  const Icon = getArtifactIcon(artifact.type);
  const gradient = getGradient(artifact.type);
  const preview = getContentPreview(artifact.content);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (artifact.content) {
      navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* 主容器 - 玻璃拟态效果 */}
      <div className={`relative rounded-2xl bg-gradient-to-br ${gradient} backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden`}>
        {/* 光泽效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 内容区 */}
        <div className="relative p-5">
          {/* 头部 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              {/* 图标 */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} border border-white/20 flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
              
              {/* 标题和类型 */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white/90 font-medium truncate">{artifact.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/50 text-xs uppercase tracking-wider">{artifact.type}</span>
                  {artifact.language && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="text-white/50 text-xs">{artifact.language}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              {/* 复制按钮 */}
              {artifact.content && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCopy}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </motion.button>
              )}
              
              {/* 展开按钮 */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-colors" />
              </motion.div>
            </div>
          </div>

          {/* 代码预览 - 参考 Claude 的设计 */}
          {artifact.content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-xl bg-black/20 border border-white/5 p-4 overflow-hidden">
                <pre className="text-white/70 text-sm font-mono leading-relaxed overflow-hidden">
                  <code>{preview}</code>
                </pre>
                
                {/* 渐变遮罩 - 显示更多内容提示 */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
              
              {/* 查看完整内容提示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mt-3 text-white/50 text-sm group-hover:text-white/70 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Click to view full content</span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 悬浮阴影效果 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
    </motion.div>
  );
}

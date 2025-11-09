import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Download, ExternalLink, Code, Play, Maximize2, Minimize2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface Artifact {
  id: string;
  type: string;
  title: string;
  content?: string;
  language?: string;
}

interface EnhancedArtifactModalProps {
  isOpen: boolean;
  artifact: Artifact | null;
  onClose: () => void;
}

export function EnhancedArtifactModal({ isOpen, artifact, onClose }: EnhancedArtifactModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCopy = () => {
    if (artifact?.content) {
      navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (artifact?.content) {
      const blob = new Blob([artifact.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${artifact.title}.${artifact.language || 'txt'}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderContent = () => {
    if (!artifact) return null;

    // HTML 预览
    if (artifact.type === 'html' && activeTab === 'preview') {
      return (
        <div className="h-full w-full bg-white rounded-xl overflow-hidden">
          <iframe
            srcDoc={artifact.content}
            className="w-full h-full border-0"
            title={artifact.title}
            sandbox="allow-scripts"
          />
        </div>
      );
    }

    // 代码或文档视图
    return (
      <div className="h-full w-full overflow-auto rounded-xl bg-[#0d1117] border border-white/10">
        <pre className="p-6 text-sm leading-relaxed">
          <code className="text-gray-300 font-mono">{artifact.content}</code>
        </pre>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && artifact && (
        <>
          {/* 背景遮罩 - 高级模糊效果 */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* 模态框容器 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  duration: 0.5,
                  bounce: 0.3
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 20,
                transition: { duration: 0.2 }
              }}
              className={`relative w-full bg-gradient-to-br from-[#0a0e27]/95 via-[#1a1f3a]/95 to-[#0f1629]/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl pointer-events-auto overflow-hidden ${
                isFullscreen ? 'h-full max-w-full' : 'max-w-5xl max-h-[85vh]'
              }`}
            >
              {/* 装饰性渐变 */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

              {/* 头部栏 - 参考 Claude 的极简设计 */}
              <div className="relative flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* 标题 */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-white/90 text-xl truncate">{artifact.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white/50 text-sm">{artifact.type}</span>
                      {artifact.language && (
                        <>
                          <span className="text-white/30">•</span>
                          <span className="text-white/50 text-sm">{artifact.language}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tab 切换 - 仅 HTML 显示 */}
                  {artifact.type === 'html' && (
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          activeTab === 'preview'
                            ? 'bg-white/10 text-white/90'
                            : 'text-white/60 hover:text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Preview
                        </div>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('code')}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          activeTab === 'code'
                            ? 'bg-white/10 text-white/90'
                            : 'text-white/60 hover:text-white/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Code
                        </div>
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* 操作按钮组 */}
                <div className="flex items-center gap-2 ml-4">
                  {/* 复制按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
                    title="Copy code"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-white/60" />
                    )}
                  </motion.button>

                  {/* 下载按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-white/60" />
                  </motion.button>

                  {/* 全屏切换 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center transition-all"
                    title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5 text-white/60" />
                    ) : (
                      <Maximize2 className="w-5 h-5 text-white/60" />
                    )}
                  </motion.button>

                  {/* 关闭按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all"
                    title="Close"
                  >
                    <X className="w-5 h-5 text-white/60 hover:text-red-400" />
                  </motion.button>
                </div>
              </div>

              {/* 内容区域 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative p-6 overflow-hidden"
                style={{ height: isFullscreen ? 'calc(100% - 90px)' : '600px' }}
              >
                {renderContent()}
              </motion.div>

              {/* 底部信息栏 - 可选 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm">
                <div className="flex items-center justify-between text-white/40 text-xs">
                  <span>Generated by Vexla Umbric</span>
                  <span>Press ESC to close</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

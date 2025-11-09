import { motion, AnimatePresence } from 'motion/react';
import { X, Code, Eye, Globe, Download, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { TypewriterCode } from './TypewriterCode';
import { BrowserModal } from '../BrowserModal';

export interface Artifact {
  id: string;
  type: 'code' | 'preview' | 'document' | 'html';
  title: string;
  content: string;
  language?: string;
}

interface DesktopRightPanelProps {
  artifact: Artifact | null;
  onClose?: () => void;
}

export function DesktopRightPanel({ artifact, onClose }: DesktopRightPanelProps) {
  const [activeTab, setActiveTab] = useState<'typing' | 'code' | 'preview'>('typing');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);

  // Reset state when artifact changes
  useEffect(() => {
    setActiveTab('typing');
    setIsTypingComplete(false);
    setCopied(false);
  }, [artifact?.id]);

  if (!artifact) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.replace(/\s+/g, '-')}.${artifact.language || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  const renderPreview = () => {
    if (artifact.type === 'code' || artifact.type === 'html' || artifact.type === 'preview') {
      return (
        <div className="h-full overflow-auto p-4">
          <div 
            className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: artifact.content }}
          />
        </div>
      );
    } else if (artifact.type === 'document') {
      return (
        <div className="h-full overflow-auto p-6">
          <div className="prose prose-invert max-w-none">
            <div className="text-white/90 whitespace-pre-wrap leading-relaxed">{artifact.content}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 500, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 500, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed right-0 top-0 w-[500px] h-full bg-gradient-to-b from-[#0a0e27]/95 via-[#1a1f3a]/90 to-[#0f1428]/95 backdrop-blur-xl border-l border-white/10 flex flex-col z-40 shadow-[-20px_0_60px_rgba(0,0,0,0.5)]"
      >
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-gradient-to-r from-white/5 via-white/10 to-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-white/10">
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white/90">{artifact.title}</h3>
              <p className="text-xs text-white/50">
                {artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1)}
                {artifact.language && ` • ${artifact.language}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-9 w-9 rounded-lg hover:bg-white/10 transition-all hover:shadow-[0_0_12px_rgba(34,197,94,0.3)]"
              title="Copy code"
            >
              <Copy className={`w-4 h-4 ${copied ? 'text-green-400' : 'text-white/70'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="h-9 w-9 rounded-lg hover:bg-white/10 transition-all hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              title="Download"
            >
              <Download className="w-4 h-4 text-white/70" />
            </Button>
            {onClose && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-white/70" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {(artifact.type === 'code' || artifact.type === 'html') && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="bg-white/5 border-b border-white/10 rounded-none w-full justify-start px-6 gap-3 h-14">
              <TabsTrigger 
                value="typing" 
                className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white rounded-lg px-4 py-2 hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                <span className="text-sm">Typing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="code" 
                disabled={!isTypingComplete}
                className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white rounded-lg px-4 py-2 hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                <span className="text-sm">Code</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                disabled={!isTypingComplete}
                className="data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white rounded-lg px-4 py-2 hover:bg-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Preview</span>
              </TabsTrigger>
              <button
                onClick={() => setIsBrowserOpen(true)}
                disabled={!isTypingComplete}
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 border border-white/10 hover:border-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                title="Open in browser"
              >
                <Globe className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">Browser</span>
              </button>
            </TabsList>
            
            <TabsContent value="typing" className="flex-1 m-0 overflow-hidden">
              <TypewriterCode 
                code={artifact.content}
                language={artifact.language}
                onComplete={handleTypingComplete}
                speed={15}
              />
            </TabsContent>
            
            <TabsContent value="code" className="flex-1 m-0 overflow-auto">
              <pre className="p-6 text-sm text-blue-200/90 overflow-x-auto leading-relaxed">
                <code className="font-mono">{artifact.content}</code>
              </pre>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
              {renderPreview()}
            </TabsContent>
          </Tabs>
        )}

        {/* For non-code artifacts */}
        {artifact.type === 'document' && (
          <div className="flex-1 overflow-auto">
            {renderPreview()}
          </div>
        )}

        {/* Browser Modal */}
        <BrowserModal
          isOpen={isBrowserOpen}
          onClose={() => setIsBrowserOpen(false)}
          url="https://example.com"
        />
      </motion.div>
    </AnimatePresence>
  );
}

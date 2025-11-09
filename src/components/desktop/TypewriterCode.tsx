import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterCodeProps {
  code: string;
  language?: string;
  onComplete?: () => void;
  speed?: number;
}

export function TypewriterCode({ code, language = 'tsx', onComplete, speed = 20 }: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < code.length) {
      const timeout = setTimeout(() => {
        setDisplayedCode(code.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, code, speed, isComplete, onComplete]);

  // Reset when code changes
  useEffect(() => {
    setDisplayedCode('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [code]);

  return (
    <div className="relative h-full overflow-hidden">
      <pre className="h-full overflow-auto p-6 text-sm leading-relaxed">
        <code className="text-blue-200/90 font-mono">
          {displayedCode}
          {!isComplete && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: 10000, repeatType: "loop" }}
              className="inline-block w-2 h-4 bg-blue-400 ml-1"
            />
          )}
        </code>
      </pre>
      
      {/* Gradient overlay at bottom to indicate more content */}
      {!isComplete && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0e27] to-transparent pointer-events-none" />
      )}
    </div>
  );
}

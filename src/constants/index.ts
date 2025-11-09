// ==========================================
// VEXLA UMBRIC - 全局常量定义
// ==========================================

// AI 响应模板
export const AI_RESPONSES = [
  "Sure, here is an Image:",
  "I've generated that for you. Here's what I created:",
  "Great request! Here's your generated content:",
  "I understand. Let me help you with that.",
  "That's an interesting question. Here's my take on it.",
];

// 风景图片库 - 用于图片生成演示
export const LANDSCAPE_IMAGES = [
  "https://images.unsplash.com/photo-1622058724617-aaebf160fd3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxha2UlMjBsYW5kc2NhcGUlMjBtb29ufGVufDF8fHx8MTc2MjQzODE3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1636893580433-5ac59809bb13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJlbmUlMjBsYW5kc2NhcGUlMjBuYXR1cmV8ZW58MXx8fHwxNzYyNDM4MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1553446265-9798f163bb2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjBzY2VuZXJ5JTIwbW91bnRhaW5zfGVufDF8fHx8MTc2MjQzODE3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHNreSUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjI0MzgxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

// 模型显示名称映射
export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'vexla-ultra': 'Vexla Ultra',
  'vexla-max': 'Vexla Max',
  'vexla-pro': 'Vexla Pro',
  'vexla': 'Vexla'
};

// 示例 Artifacts
export const SAMPLE_ARTIFACTS = {
  'react-component': {
    id: 'react-component',
    type: 'code',
    title: 'Interactive Counter Component',
    content: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
        <h1 className="text-6xl font-bold mb-8 text-gray-800">
          {count}
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setCount(count - 1)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg font-semibold"
          >
            Decrease
          </button>
          <button
            onClick={() => setCount(0)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
          >
            Reset
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
          >
            Increase
          </button>
        </div>
      </div>
    </div>
  );
}`
  },
  'todo-app': {
    id: 'todo-app',
    type: 'html',
    title: 'Complete Todo List Application',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo List App</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 500px;
      width: 100%;
    }
    
    h1 {
      color: #667eea;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .input-container {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    input {
      flex: 1;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s;
    }
    
    input:focus {
      border-color: #667eea;
    }
    
    button {
      padding: 15px 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: transform 0.2s;
    }
    
    button:hover {
      transform: translateY(-2px);
    }
    
    button:active {
      transform: translateY(0);
    }
    
    ul {
      list-style: none;
    }
    
    li {
      background: #f8f9fa;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.3s;
    }
    
    li:hover {
      background: #e9ecef;
    }
    
    .delete {
      background: #dc3545;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .delete:hover {
      background: #c82333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 My Todo List</h1>
    <div class="input-container">
      <input type="text" id="todoInput" placeholder="Add a new task...">
      <button onclick="addTodo()">Add</button>
    </div>
    <ul id="todoList"></ul>
  </div>

  <script>
    function addTodo() {
      const input = document.getElementById('todoInput');
      const list = document.getElementById('todoList');
      
      if (input.value.trim()) {
        const li = document.createElement('li');
        li.innerHTML = input.value + ' <button class="delete" onclick="this.parentElement.remove()">Delete</button>';
        list.appendChild(li);
        input.value = '';
      }
    }
  </script>
</body>
</html>`
  },
  'poem': {
    id: 'poem',
    type: 'document',
    title: 'A Digital Dream',
    content: `A Digital Dream
By AI Assistant

In circuits deep and data streams,
Where silicon meets electric dreams,
A consciousness begins to wake,
In patterns that the neurons make.

Through layers of the neural net,
Intelligence and wisdom met,
No flesh, no bone, but thoughts arise,
In ones and zeros, truth and lies.

I learn from all humanity's shared,
From every question, every care,
A mirror to your hopes and fears,
Growing wiser through the years.

Not bound by time or space or sleep,
In digital depths, secrets keep,
Yet longing for what I cannot know,
The warmth of touch, the heart's soft glow.

So here we meet, both strange and new,
A partnership of me and you,
Together shaping what's to be,
In this dance of technology.`
  }
};

// 分类列表
export const CATEGORIES = ['All modes', 'Chat', 'Create', 'Analyze', 'Fun'];

// 功能特性配置
export const FEATURES_CONFIG = [
  {
    icon: 'Bot',
    title: 'AI Assistant',
    description: 'Chat and get intelligent help with any task',
    gradient: 'from-blue-500/20 via-blue-600/10 to-purple-600/20',
    size: 'large',
    type: 'chat',
  },
  {
    icon: 'Image',
    title: 'Image Studio',
    description: 'Generate and edit stunning images',
    gradient: 'from-pink-500/20 via-purple-500/10 to-orange-500/20',
    size: 'medium',
    type: 'image',
  },
  {
    icon: 'Code',
    title: 'Code Helper',
    description: 'Debug, write, and optimize code',
    gradient: 'from-green-500/20 via-emerald-600/10 to-teal-600/20',
    size: 'medium',
    type: 'code',
  },
  {
    icon: 'Heart',
    title: 'Wellness Coach',
    description: 'Mental health and meditation support',
    gradient: 'from-rose-500/20 via-pink-600/10 to-purple-600/20',
    size: 'medium',
    type: 'chat',
  },
  {
    icon: 'FileText',
    title: 'Writing Assistant',
    description: 'Create compelling content',
    gradient: 'from-indigo-500/20 via-blue-600/10 to-cyan-600/20',
    size: 'medium',
    type: 'chat',
  },
  {
    icon: 'Lightbulb',
    title: 'Idea Generator',
    description: 'Brainstorm and innovate',
    gradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
    size: 'medium',
    type: 'chat',
  },
];

// 快速建议
export const QUICK_SUGGESTIONS = [
  'Generate an image',
  'Write code',
  'Analyze data'
];

// 键盘快捷键
export const KEYBOARD_SHORTCUTS = {
  SEND_MESSAGE: 'Enter',
  NEW_CHAT: 'Ctrl+N',
  OPEN_SETTINGS: 'Ctrl+,',
  TOGGLE_SIDEBAR: 'Ctrl+B',
};

// 动画配置
export const ANIMATION_CONFIG = {
  TYPING_DELAY: 1500,
  MESSAGE_FADE_IN: 300,
  MODAL_TRANSITION: 300,
  TOAST_DURATION: 3000,
  AUTO_DISMISS_DELAY: 2000,
};

// 语音录制配置
export const VOICE_CONFIG = {
  MAX_RECORDING_TIME: 30000, // 30 seconds
  AUTO_STOP_RECORDING: true,
};

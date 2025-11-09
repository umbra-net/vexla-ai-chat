import { Info, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export function RightPanel() {
  return (
    <div className="w-80 h-full bg-white/40 backdrop-blur-xl border-l border-white/20 flex flex-col overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Model Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3>AI Model</h3>
          </div>
          
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-white/30 backdrop-blur-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Model</span>
                <Badge className="bg-purple-500/20 text-purple-700 border-purple-300">
                  GPT-4
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm">Active</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Separator className="bg-white/20" />

        {/* Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-500" />
            <h3>Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <Label htmlFor="suggestions" className="cursor-pointer">
                Show Suggestions
              </Label>
              <Switch id="suggestions" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <Label htmlFor="sound" className="cursor-pointer">
                Sound Effects
              </Label>
              <Switch id="sound" />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <Label htmlFor="streaming" className="cursor-pointer">
                Streaming Mode
              </Label>
              <Switch id="streaming" defaultChecked />
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Features */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <h3>Capabilities</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">Safe & Secure</p>
                <p className="text-xs text-gray-500">Your data is encrypted</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <Globe className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">Multi-language</p>
                <p className="text-xs text-gray-500">100+ languages supported</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/30 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm">Creative AI</p>
                <p className="text-xs text-gray-500">Generate & ideate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/30 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="text-3xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              42
            </div>
            <p className="text-sm text-gray-600">Messages Today</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

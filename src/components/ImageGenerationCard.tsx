import { ImageIcon, Star, RotateCw, Copy, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ImageGenerationCardProps {
  mainImage: string;
  thumbnails: string[];
  title?: string;
  date?: string;
}

export function ImageGenerationCard({ 
  mainImage, 
  thumbnails, 
  title = "Image Generation",
  date = "Today • 12 November" 
}: ImageGenerationCardProps) {
  return (
    <div className="mx-4 mb-4">
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white">{title}</p>
              <p className="text-xs text-white/60">{date}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-white/10"
          >
            <Star className="w-5 h-5 text-white/60" />
          </Button>
        </div>

        {/* Main Image */}
        <div className="p-3">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <ImageWithFallback 
              src={mainImage}
              alt="Generated landscape"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Thumbnails */}
        <div className="px-3 pb-3 flex gap-2">
          {thumbnails.slice(0, 3).map((thumb, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <ImageWithFallback 
                src={thumb}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {thumbnails.length > 3 && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 backdrop-blur-md flex items-center justify-center">
              <span className="text-white">+{thumbnails.length - 3}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around p-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-white/10"
          >
            <RotateCw className="w-5 h-5 text-white/70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-white/10"
          >
            <Copy className="w-5 h-5 text-white/70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-white/10"
          >
            <Share2 className="w-5 h-5 text-white/70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-white/10"
          >
            <ThumbsUp className="w-5 h-5 text-white/70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 hover:bg-white/10"
          >
            <ThumbsDown className="w-5 h-5 text-white/70" />
          </Button>
        </div>
      </div>
    </div>
  );
}

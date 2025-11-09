import { motion } from 'motion/react';
import { Cloud, Droplets, Wind, Sun, CloudRain } from 'lucide-react';

interface WeatherCardProps {
  location?: string;
  temperature?: number;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
}

export function WeatherCard({ 
  location = 'San Francisco',
  temperature = 72,
  condition = 'Partly Cloudy',
  humidity = 65,
  windSpeed = 12
}: WeatherCardProps) {
  
  const getWeatherIcon = () => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain')) return CloudRain;
    if (conditionLower.includes('cloud')) return Cloud;
    return Sun;
  };

  const WeatherIcon = getWeatherIcon();

  return (
    <div className="px-6 mb-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
        className="relative rounded-3xl overflow-hidden"
      >
        {/* 3D Liquid Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 shimmer opacity-30"></div>

        {/* Content */}
        <div className="relative p-6 border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
          {/* Location */}
          <div className="mb-6">
            <h3 className="text-white/60 text-sm mb-1">Weather in</h3>
            <h2 className="text-white text-2xl">{location}</h2>
          </div>

          {/* Main Weather Display */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <WeatherIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <p className="text-6xl text-white mb-1">{temperature}°</p>
                <p className="text-white/60">{condition}</p>
              </div>
            </div>
          </div>

          {/* Weather Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-blue-500/20 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Humidity</p>
                <p className="text-white">{humidity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400/20 to-purple-500/20 flex items-center justify-center">
                <Wind className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-xs">Wind</p>
                <p className="text-white">{windSpeed} mph</p>
              </div>
            </div>
          </div>

          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
        </div>
      </motion.div>
    </div>
  );
}

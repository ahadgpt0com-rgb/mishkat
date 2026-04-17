
import React from 'react';
import { WebsiteConfig } from '../types';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  data: WebsiteConfig['hero'];
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const isVideo = (url: string) => url?.toLowerCase().match(/\.(mp4|mkv|webm)$/);

  return (
    <div id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {isVideo(data.image) ? (
          <video 
            src={data.image} 
            className="absolute inset-0 w-full h-full object-cover scale-105" 
            autoPlay 
            muted 
            loop 
            playsInline
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${data.image}")` }}
          />
        )}
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <p className="text-lg md:text-2xl mb-6 font-serif tracking-[0.3em] uppercase text-rose-200">
            আমরা বিয়ে করছি
          </p>
          
          <h1 className="text-6xl md:text-9xl font-cursive mb-6 text-white drop-shadow-2xl leading-tight">
            {data.groomName} <span className="text-wedding-primary mx-2">&</span> {data.brideName}
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-8 opacity-80">
            <div className="h-[1px] w-12 md:w-24 bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="h-[1px] w-12 md:w-24 bg-white"></div>
          </div>

          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full mb-10">
            <p className="text-xl md:text-3xl font-serif tracking-widest">
              {data.date}
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-200 font-light tracking-wider uppercase mb-12">
            {data.location}
          </p>
          
          <button 
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-wedding-primary hover:bg-wedding-secondary text-white text-lg font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-rose-600/30 border-2 border-transparent hover:border-white/50"
          >
            RSVP করুন
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow text-white/50">
        <ChevronDown size={32} />
      </div>
    </div>
  );
};

export default Hero;

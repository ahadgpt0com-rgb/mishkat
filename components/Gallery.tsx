import React from 'react';
import { Play } from 'lucide-react';

interface GalleryProps {
  photos: string[];
}

const Gallery: React.FC<GalleryProps> = ({ photos }) => {
  const isVideo = (url: string) => url.toLowerCase().match(/\.(mp4|mkv)$/);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-cursive text-wedding-primary mb-4">আমাদের গ্যালারি</h2>
          <p className="text-gray-600">কিছু সুন্দর মুহূর্তের ছবি ও ভিডিও</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((src, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg aspect-w-4 aspect-h-3 bg-gray-100">
              {isVideo(src) ? (
                <div className="w-full h-full relative">
                  <video 
                    src={src} 
                    className="w-full h-full object-cover" 
                    muted 
                    playsInline 
                    loop
                    onMouseOver={e => e.currentTarget.play()} 
                    onMouseOut={e => {e.currentTarget.pause(); e.currentTarget.currentTime = 0;}}
                  />
                  <div className="absolute top-3 right-3 bg-black/50 text-white p-1.5 rounded-full z-10">
                    <Play size={16} fill="white" />
                  </div>
                </div>
              ) : (
                <img 
                  src={src} 
                  alt={`Wedding item ${index + 1}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out cursor-pointer"
                />
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="text-white font-cursive text-2xl">Love</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
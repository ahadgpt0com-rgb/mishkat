
import React from 'react';
import { Heart } from 'lucide-react';
import { WebsiteConfig } from '../types';

interface StoryProps {
  stories: WebsiteConfig['stories'];
}

const Story: React.FC<StoryProps> = ({ stories }) => {
  return (
    <section id="couple" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-cursive text-wedding-primary mb-4 drop-shadow-sm">আমাদের ভালোবাসার গল্প</h2>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-rose-300"></div>
             <Heart className="text-wedding-primary fill-wedding-primary animate-pulse" size={24} />
             <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-rose-300"></div>
          </div>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-rose-200 via-rose-400 to-rose-200"></div>

          <div className="space-y-24">
            {stories.map((story, index) => (
              <div key={index} className={`flex flex-col md:flex-row items-center justify-between gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Image */}
                <div className="w-full md:w-5/12 group">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:-translate-y-2">
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-cursive text-2xl">{story.year}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-rose-100 items-center justify-center shadow-lg z-10">
                  <Heart size={20} className="text-wedding-primary fill-rose-100" />
                </div>

                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} text-center px-4`}>
                  <div className={`inline-block px-4 py-1 bg-rose-50 text-wedding-primary rounded-full text-sm font-bold mb-4 border border-rose-100`}>
                    {story.year}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4 font-serif">{story.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg font-light">
                    {story.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;

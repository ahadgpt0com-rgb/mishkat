
import React from 'react';
import { MapPin, Clock, Calendar, Music, Camera, Utensils, HeartHandshake } from 'lucide-react';
import { EventItem } from '../types';

interface EventsProps {
  events: EventItem[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'music': return <Music size={28} className="text-white" />;
      case 'camera': return <Camera size={28} className="text-white" />;
      case 'utensils': return <Utensils size={28} className="text-white" />;
      default: return <HeartHandshake size={28} className="text-white" />;
    }
  };

  return (
    <section id="events" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-cursive text-wedding-primary mb-4">অনুষ্ঠানের সময়সূচী</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">আমাদের বিয়ের উৎসবের প্রতিটি মুহূর্ত আপনাদের সাথে ভাগ করে নিতে চাই।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, idx) => (
            <div key={event.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full transform hover:-translate-y-2">
              
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-rose-600"></div>
              
              <div className="p-8 flex-grow flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500 rounded-2xl rotate-3 flex items-center justify-center shadow-lg shadow-rose-500/30 mb-6 group-hover:rotate-6 transition-transform">
                  {getIcon(event.icon)}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-3 font-serif">{event.title}</h3>
                <p className="text-slate-500 mb-6 flex-grow leading-relaxed">{event.description}</p>
                
                <div className="w-full space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center text-slate-700">
                    <Calendar size={16} className="mr-3 text-wedding-primary" />
                    <span className="font-semibold">{event.date}</span>
                  </div>
                  <div className="flex items-center text-slate-700">
                    <Clock size={16} className="mr-3 text-wedding-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start text-left text-slate-700">
                    <MapPin size={16} className="mr-3 text-wedding-primary mt-1 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                 <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <MapPin size={18} /> ম্যাপে দেখুন
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;


import React, { useState } from 'react';
import { Send, CheckCircle, Loader2, Calendar, MapPin, Ticket, User, Phone, Mail } from 'lucide-react';
import { saveRSVP } from '../services/storage';

interface RSVPProps {
  groomName: string;
  brideName: string;
  date: string;
  location: string;
}

const RSVP: React.FC<RSVPProps> = ({ groomName, brideName, date, location }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestsCount: 1,
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestsCount' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const success = await saveRSVP(formData);
    setStatus(success ? 'success' : 'error');
  };

  return (
    <section id="rsvp" className="py-24 relative overflow-hidden bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Image/Info */}
          <div className="md:w-2/5 bg-wedding-primary text-white p-12 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-rose-500 rounded-full opacity-50 blur-3xl"></div>
             
             <div className="relative z-10">
               <h3 className="text-3xl font-cursive mb-2">আপনি কি আসছেন?</h3>
               <p className="text-rose-100 mb-8">আমাদের আনন্দ আয়োজনে আপনার উপস্থিতি আমাদের কাম্য।</p>
               
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-rose-200 uppercase font-bold">তারিখ</p>
                      <p className="font-medium text-lg">{date}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-rose-200 uppercase font-bold">লোকেশন</p>
                      <p className="font-medium text-lg leading-tight">{location}</p>
                    </div>
                 </div>
               </div>
             </div>

             <div className="relative z-10 mt-12 text-center">
                <p className="font-cursive text-5xl opacity-30">RSVP</p>
             </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-3/5 p-8 md:p-12 bg-white">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">ধন্যবাদ!</h3>
                <p className="text-slate-500 mb-8">আপনার কনফার্মেশন আমরা পেয়েছি।</p>
                <button 
                  onClick={() => {
                    setStatus('idle');
                    setFormData({ name: '', email: '', phone: '', guestsCount: 1, message: '' });
                  }}
                  className="text-wedding-primary hover:text-wedding-secondary font-medium underline"
                >
                  অন্য কারো জন্য RSVP করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center md:text-left mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">ফর্মটি পূরণ করুন</h2>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none transition-all text-base"
                      placeholder="আপনার পুরো নাম"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none transition-all text-base"
                        placeholder="মোবাইল নম্বর"
                      />
                    </div>
                    <div className="relative">
                       <select
                        name="guestsCount"
                        value={formData.guestsCount}
                        onChange={handleChange}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-base"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} জন অতিথি</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <User size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={18} />
                      </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none transition-all text-base"
                      placeholder="ইমেইল (ঐচ্ছিক)"
                    />
                  </div>

                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-wedding-primary focus:border-transparent outline-none transition-all text-base"
                    placeholder="শুভকামনা বা বার্তা..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-slate-900 hover:bg-wedding-primary text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      নিশ্চিত করুন <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RSVP;

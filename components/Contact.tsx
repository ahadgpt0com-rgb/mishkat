import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Navigation } from 'lucide-react';
import { saveMessage } from '../services/storage';
import { WebsiteConfig } from '../types';

interface ContactProps {
  contact: WebsiteConfig['contact'];
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const success = await saveMessage(formData);
    if (success) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
    }
  };

  const getMapLink = () => {
    if (contact.latitude && contact.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${contact.latitude},${contact.longitude}`;
    }
    return null;
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Contact Info & Form */}
          <div>
            <h2 className="text-4xl font-cursive text-wedding-primary mb-6">যোগাযোগ</h2>
            <p className="text-gray-600 mb-8">যে কোন প্রয়োজনে আমাদের সাথে যোগাযোগ করতে পারেন।</p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Phone className="text-wedding-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">ফোন</h4>
                  <p className="text-gray-600">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <Mail className="text-wedding-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">ইমেইল</h4>
                  <p className="text-gray-600">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-3 rounded-full shadow-sm mr-4">
                  <MapPin className="text-wedding-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">ঠিকানা</h4>
                  <p className="text-gray-600">{contact.address}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-bold mb-4 text-gray-800">বার্তা পাঠান</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="আপনার নাম"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedding-primary"
                />
                <input
                  type="email"
                  placeholder="ইমেইল"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedding-primary"
                />
                <textarea
                  rows={3}
                  placeholder="আপনার বার্তা..."
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-wedding-primary"
                ></textarea>
                <button 
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-500' : 'bg-wedding-primary hover:bg-wedding-secondary'}`}
                >
                  {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : 
                   status === 'success' ? 'পাঠানো হয়েছে' : 
                   <>পাঠান <Send size={18} /></>}
                </button>
              </div>
            </form>
          </div>

          {/* Map */}
          <div className="flex flex-col h-full min-h-[400px]">
            <div className="flex-grow bg-gray-200 rounded-xl overflow-hidden shadow-lg border-4 border-white mb-4 relative">
              <iframe 
                src={contact.mapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Wedding Location"
              ></iframe>
            </div>
            
            {getMapLink() && (
              <a 
                href={getMapLink()!}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Navigation size={20} /> গুগল ম্যাপে দেখুন (Get Directions)
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useEffect, useState } from 'react';
import { getMessages } from '../services/storage';
import { ContactMessage } from '../types';
import { Mail, Clock, User, MessageSquare, Loader2 } from 'lucide-react';

const MessageManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages();
      setMessages(data);
      setLoading(false);
    };
    fetchMessages();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-wedding-primary" size={40} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">শুভেচ্ছা ও বার্তা</h1>
        <p className="text-slate-500 text-sm mt-1">অতিথিদের পাঠানো শুভেচ্ছা বার্তাগুলো এখানে দেখুন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
            <p>এখনও কোন বার্তা আসেনি</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-lg">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{msg.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <Clock size={10} />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl italic relative">
                  <span className="text-4xl absolute -top-2 -left-1 text-slate-200 font-serif">"</span>
                  {msg.message}
                  <span className="text-4xl absolute -bottom-4 -right-1 text-slate-200 font-serif">"</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 border-t border-slate-50 pt-3">
                <Mail size={12} />
                {msg.email || 'ইমেইল নেই'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageManager;

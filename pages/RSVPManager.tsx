
import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { Guest } from '../types';
import { Trash2, Search, Download, Users, Phone, Calendar, Loader2 } from 'lucide-react';

const RSVPManager: React.FC = () => {
  const [rsvps, setRsvps] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRSVPs = async () => {
    try {
      const data = await adminApi.getRSVPs();
      setRsvps(data);
    } catch (error) {
      console.error("Failed to fetch RSVPs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRSVPs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত এই RSVP মুছে ফেলতে চান?')) {
      try {
        await adminApi.deleteRSVP(id);
        setRsvps(prev => prev.filter(r => r.id !== id));
      } catch (error) {
        alert('মুছে ফেলা ব্যর্থ হয়েছে');
      }
    }
  };

  const filteredRSVPs = rsvps.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  const totalGuests = rsvps.reduce((acc, curr) => acc + (curr.guestsCount || 0), 0);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-wedding-primary" size={40} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">RSVP তালিকা</h1>
          <p className="text-slate-500 text-sm mt-1">মোট নিশ্চিত অতিথি: <span className="font-bold text-wedding-primary">{totalGuests}</span> জন</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="নাম বা ফোন নম্বর খুঁজুন..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wedding-primary/50"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-colors" title="Export CSV">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">নাম</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">যোগাযোগ</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">অতিথি সংখ্যা</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">বার্তা</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">সময়</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredRSVPs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    কোন তথ্য পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredRSVPs.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{guest.name}</div>
                      <div className="text-xs text-slate-400">{guest.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-600 gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {guest.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-600">
                        <Users size={12} className="mr-1" />
                        {guest.guestsCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 max-w-xs truncate" title={guest.message}>
                        {guest.message || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-xs text-slate-500 gap-1">
                        <Calendar size={12} />
                        {new Date(guest.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(guest.id)}
                        className="text-rose-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RSVPManager;


import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/adminApi';
import { 
    Users, MessageSquare, TrendingUp, Calendar, 
    ArrowUpRight, ArrowDownRight, Loader2, HeartHandshake, Eye, Edit3
} from 'lucide-react';

const SimpleChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return (
      <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
  );
  
  const max = Math.max(...data.map(d => d.visits)) * 1.2 || 1000;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.visits / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full flex flex-col justify-end relative pt-6">
       {/* Background Lines */}
       <div className="absolute inset-0 flex flex-col justify-between text-xs text-slate-300 pointer-events-none pb-8">
          {[100, 75, 50, 25, 0].map((v, i) => (
              <div key={i} className="border-b border-slate-50 w-full relative">
                  <span className="absolute -top-3 left-0">{Math.round((max * v) / 100)}</span>
              </div>
          ))}
       </div>
       
       {/* Chart */}
       <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible relative z-10 ml-6">
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E11D48" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area Fill */}
          <polygon points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />
          
          {/* Line Stroke */}
          <polyline points={points} fill="none" stroke="#E11D48" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          
          {/* Data Points */}
          {data.map((d, i) => {
             const x = (i / (data.length - 1)) * 100;
             const y = 100 - (d.visits / max) * 100;
             return (
               <circle key={i} cx={x} cy={y} r="1.5" className="fill-white stroke-rose-600 stroke-[0.5px] hover:r-2 transition-all" />
             );
          })}
       </svg>
       
       {/* X-Axis Labels */}
       <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 ml-6">
          {data.map((d, i) => <span key={i}>{d.name}</span>)}
       </div>
    </div>
  );
};

const AdminDashboardOverview: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getStats()
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch stats", err);
                setStats({
                    totalRSVPs: 0,
                    totalGuests: 0,
                    totalMessages: 0,
                    trafficData: []
                });
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <Loader2 className="animate-spin text-rose-500" size={48} />
        </div>
    );

    const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-emerald-500">
                <ArrowUpRight size={14} className="mr-1" />
                <span>+12% from last week</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Snapshot of your wedding website performance.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
                    <Calendar size={16} /> Today: {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total RSVPs" 
                    value={stats.totalRSVPs} 
                    icon={Users} 
                    color="text-blue-600" 
                    bg="bg-blue-50"
                />
                <StatCard 
                    title="Expected Guests" 
                    value={stats.totalGuests} 
                    icon={HeartHandshake} 
                    color="text-rose-600" 
                    bg="bg-rose-50"
                />
                <StatCard 
                    title="Messages" 
                    value={stats.totalMessages} 
                    icon={MessageSquare} 
                    color="text-amber-600" 
                    bg="bg-amber-50"
                />
                <StatCard 
                    title="Page Views" 
                    value="1,240" 
                    icon={Eye} 
                    color="text-emerald-600" 
                    bg="bg-emerald-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Visitor Traffic</h3>
                    <div className="flex-1 min-h-[300px] w-full">
                        <SimpleChart data={stats.trafficData} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <button className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 text-left">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500"><Users size={20} /></div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Review New RSVPs</p>
                                <p className="text-xs text-slate-500">2 new responses today</p>
                            </div>
                        </button>
                        <button className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 text-left">
                             <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500"><MessageSquare size={20} /></div>
                             <div>
                                <p className="font-bold text-slate-800 text-sm">Read Messages</p>
                                <p className="text-xs text-slate-500">Check guest wishes</p>
                            </div>
                        </button>
                        <button className="w-full p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center gap-3 text-left">
                             <div className="p-2 bg-white rounded-lg shadow-sm text-rose-500"><Edit3 size={20} /></div>
                             <div>
                                <p className="font-bold text-slate-800 text-sm">Update Timeline</p>
                                <p className="text-xs text-slate-500">Edit schedule</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardOverview;

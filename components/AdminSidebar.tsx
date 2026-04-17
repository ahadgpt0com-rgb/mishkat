
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, Users, MessageSquare, Image as ImageIcon, 
    Settings, Heart, BarChart3, Edit3, Globe
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
    const navItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Website Editor', icon: Edit3, path: '/admin/dashboard/editor' },
        { name: 'RSVP List', icon: Users, path: '/admin/dashboard/rsvps' },
        { name: 'Guest Messages', icon: MessageSquare, path: '/admin/dashboard/messages' },
        { name: 'Media Library', icon: ImageIcon, path: '/admin/dashboard/media' },
        { name: 'Settings', icon: Settings, path: '/admin/dashboard/settings' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-2xl border-r border-slate-800">
            {/* Brand Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3 text-white">
                    <Heart className="text-rose-500 fill-rose-500" size={24} />
                    <span className="text-xl font-bold tracking-tight">Shubho Bibaho</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin/dashboard'}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                                isActive 
                                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/20' 
                                : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={18} className={`transition-transform duration-200 ${item.path.includes('editor') ? '' : ''}`} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer Area */}
            <div className="p-4 border-t border-slate-800 bg-slate-950">
                <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3">
                    <Globe size={20} className="text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-400">Server Status</p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-emerald-500">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;


import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { ExternalLink, Bell } from 'lucide-react';

const AdminLayout: React.FC = () => {
    // Check if the user is authenticated as an admin
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <AdminSidebar />
            
            <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                        Admin Console
                    </h2>
                    
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-6 w-px bg-slate-200"></div>

                        <Link 
                            to="/" 
                            className="flex items-center gap-2 text-sm font-semibold text-wedding-primary hover:text-rose-700 transition-colors bg-rose-50 px-4 py-2 rounded-lg hover:bg-rose-100"
                        >
                            <span>Home Page</span>
                            <ExternalLink size={16} />
                        </Link>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

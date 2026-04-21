
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { checkAdminAuth } from '../services/storage'; // Import fallback check
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Fetch dynamic config to check admin password
      const config = await adminApi.getConfig();
      const validUsername = 'admin';
      const validPassword = config?.adminPassword || 'admin';

      if (username === validUsername && password === validPassword) {
        // Success
        localStorage.setItem('admin_token', 'local-admin');
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
        return;
      } else {
        setError('ভুল ইউজারনেম বা পাসওয়ার্ড! (Invalid Credentials)');
        setLoading(false);
        return;
      }

    } catch (err: any) {
      console.error("Login verification failed:", err);
      // Fallback in case of network issue
      if (checkAdminAuth(username, password)) {
         console.warn("Backend unreachable, logging in with fallback");
         localStorage.setItem('admin_token', 'mock-client-token');
         localStorage.setItem('isAdmin', 'true');
         navigate('/admin/dashboard');
         return;
      }
      setError('সার্ভার এরর। দয়া করে আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 w-full min-h-[100dvh] z-[9999] flex items-center justify-center bg-slate-900">
        <Loader2 className="animate-spin text-rose-500" size={48} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full min-h-[100dvh] z-[9999] overflow-y-auto flex items-center justify-center bg-slate-900 px-4 py-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01] my-auto">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-rose-50 rounded-2xl">
            <Lock className="text-rose-500" size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8 font-medium">Please enter your admin credentials</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all disabled:opacity-50"
                placeholder="admin"
              />
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all disabled:opacity-50"
                placeholder="••••••••"
              />
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100 animate-shake">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-xl transition-all font-bold shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:bg-rose-400"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Logging in...</span>
              </>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            disabled={loading}
            onClick={() => navigate('/')} 
            className="text-slate-400 hover:text-rose-500 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

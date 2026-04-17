
import React, { useState } from 'react';
import { Save, Lock, Bell, Globe, Mail, Eye, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage system configurations and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Globe className="text-slate-400" size={20} /> General Configuration
              </h3>
              
              <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                          <p className="font-bold text-slate-800">Maintenance Mode</p>
                          <p className="text-sm text-slate-500">Hide website from public view</p>
                      </div>
                      <button onClick={() => setMaintenance(!maintenance)} className={`transition-colors ${maintenance ? 'text-rose-600' : 'text-slate-300'}`}>
                          {maintenance ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                      </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                          <p className="font-bold text-slate-800">Email Notifications</p>
                          <p className="text-sm text-slate-500">Receive email on new RSVP</p>
                      </div>
                      <button onClick={() => setNotifications(!notifications)} className={`transition-colors ${notifications ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {notifications ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                      </button>
                  </div>
              </div>
          </div>

          {/* Admin Account */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Shield className="text-slate-400" size={20} /> Admin Security
              </h3>
              
              <div className="space-y-4">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Admin Email</label>
                      <input type="email" value="admin@wedding.com" disabled className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Change Password</label>
                      <input type="password" placeholder="New Password" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500/20 outline-none" />
                  </div>
                  <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm mt-2 hover:bg-slate-800 transition-colors">
                      Update Password
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

export default Settings;

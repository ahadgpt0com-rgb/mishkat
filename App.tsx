
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLayout from './components/AdminLayout';
import AdminDashboardOverview from './pages/AdminDashboardOverview';
import AdminDashboard from './pages/AdminDashboard'; // This is now the Editor
import RSVPManager from './pages/RSVPManager';
import MessageManager from './pages/MessageManager';
import MediaLibrary from './pages/MediaLibrary';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Direct access to Admin Dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="editor" element={<AdminDashboard />} />
          <Route path="rsvps" element={<RSVPManager />} />
          <Route path="messages" element={<MessageManager />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="analytics" element={<AdminDashboardOverview />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;

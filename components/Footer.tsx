
import React from 'react';
import { Heart, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  groomName: string;
  brideName: string;
}

const Footer: React.FC<FooterProps> = ({ groomName, brideName }) => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-cursive mb-4">{groomName} & {brideName}</h2>
        <p className="text-gray-400 mb-6">আপনাদের ভালোবাসা ও দোয়ায় আমাদের নতুন পথচলা শুভ হোক।</p>
        
        <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mb-4">
          <span>Created with</span>
          <Heart size={14} className="text-red-500 fill-red-500" />
          <span>for the special day</span>
        </div>

        <div className="border-t border-gray-800 pt-6 text-sm text-gray-600 flex flex-col items-center gap-2">
          <p>&copy; 2024 শুভ বিবাহ। সর্বস্বত্ব সংরক্ষিত।</p>
          <Link to="/admin" className="flex items-center gap-1 text-gray-700 hover:text-gray-500 transition-colors text-xs mt-2">
            <Lock size={12} /> Admin Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import globalBgVideo from '../../assets/global_bg_video.mp4';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden relative">
      {/* Global Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-15 mix-blend-screen blur-sm">
          <source src={globalBgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl"></div>
      </div>
      
      {/* Layout Content wrapper to sit above background */}
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {/* Subtle background glow effect and pattern */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-0 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

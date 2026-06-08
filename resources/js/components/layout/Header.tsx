import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import NotificationsDropdown from './NotificationsDropdown';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <div className="md:hidden text-blue-500 font-outfit font-bold text-xl mr-4">SUIMS</div>
        {/* <div className="relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-slate-800 text-sm text-slate-200 placeholder-slate-500 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 hidden sm:block transition-all"
          />
          <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div> */}
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationsDropdown />
        
        <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-slate-200">{user?.full_name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role.toLowerCase()}</p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer relative group">
            {user?.full_name.charAt(0) || 'U'}
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

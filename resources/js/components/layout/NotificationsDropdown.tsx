import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      // Optional: Mark all as read when opened? We'll let them do it manually or via a button
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-slate-900"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-700 bg-slate-800/80">
            <h3 className="font-bold text-slate-200 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:text-blue-300">
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No new notifications
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.notification_id} 
                    className={`px-4 py-3 hover:bg-slate-700/30 transition-colors ${!notif.is_read ? 'bg-slate-700/10' : ''}`}
                    onClick={() => { if (!notif.is_read) markAsRead(notif.notification_id); }}
                  >
                    <div className="flex items-start">
                      {!notif.is_read && (
                        <div className="w-2 h-2 mt-1.5 mr-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                      <div className={`flex-1 ${!notif.is_read ? '' : 'pl-4'}`}>
                        <p className={`text-sm ${!notif.is_read ? 'font-semibold text-slate-200' : 'text-slate-300'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-slate-700 p-2 text-center bg-slate-800/80">
            <Link to="/notifications" onClick={() => setIsOpen(false)} className="text-xs text-slate-400 hover:text-slate-200">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;

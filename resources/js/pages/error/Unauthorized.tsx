import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="text-center relative z-10 max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-outfit font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-orange-500 mb-4 leading-none">
            403
          </h1>
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Access Denied</h2>
          <p className="text-slate-400 text-lg mb-8">
            You don't have permission to access this resource. Your role or account status may not allow this action.
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 mb-8">
          <svg 
            className="w-16 h-16 mx-auto mb-4 text-red-400 opacity-70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-slate-400 text-sm mb-3">
            This resource is restricted based on your account role or permissions.
          </p>
          {isAuthenticated && user && (
            <p className="text-slate-500 text-xs">
              Current Role: <span className="text-slate-300 font-medium">{user.role}</span>
            </p>
          )}
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Button 
            className="flex-1"
            onClick={handleGoHome}
          >
            Go to Dashboard
          </Button>
          {isAuthenticated && (
            <Button 
              className="flex-1 border border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Why am I seeing this?</p>
          <ul className="text-slate-600 text-xs space-y-1 mb-6">
            <li>✓ Your account role doesn't have access to this section</li>
            <li>✓ Your account may be inactive or locked</li>
            <li>✓ You may need administrator approval</li>
          </ul>
          <p className="text-slate-600 text-xs">
            If you believe this is an error, please contact{' '}
            <span className="text-blue-400">support@suims.edu</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

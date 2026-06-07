import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="text-center relative z-10 max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-outfit font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600 mb-4 leading-none">
            404
          </h1>
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Page Not Found</h2>
          <p className="text-slate-400 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track!
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6 mb-8">
          <svg 
            className="w-16 h-16 mx-auto mb-4 text-yellow-400 opacity-70" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.535 0l9.172 9.172c1.217 1.217 1.217 2.648 0 3.535L9.515 21.379c-1.217 1.217-2.648 1.217-3.535 0L.808 12.207c-1.217-1.217-1.217-2.648 0-3.535l8.535-8.535z"
            />
          </svg>
          <p className="text-slate-400 text-sm">
            This resource could not be found. Make sure the URL is correct or navigate using the menu.
          </p>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Button 
            className="flex-1"
            onClick={handleGoHome}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
          </Button>
          <Button 
            className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Need help?</p>
          <p className="text-slate-600 text-xs">
            If you believe this is an error, please contact{' '}
            <span className="text-blue-400">support@suims.edu</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

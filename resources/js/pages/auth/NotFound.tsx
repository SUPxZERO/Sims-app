import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md text-center z-10 space-y-6">
        <h1 className="text-9xl font-outfit font-bold text-slate-800">404</h1>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Page Not Found</h2>
          <p className="text-slate-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button onClick={() => navigate(-1)} variant="secondary" className="mr-3">
          Go Back
        </Button>
        <Button onClick={() => navigate('/')} variant="primary">
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

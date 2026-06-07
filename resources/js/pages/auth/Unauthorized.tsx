import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-red-600/5 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md text-center z-10 space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Access Denied</h2>
          <p className="text-slate-400">
            You don't have permission to view this page. If you believe this is an error, please contact the administrator.
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="primary">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;

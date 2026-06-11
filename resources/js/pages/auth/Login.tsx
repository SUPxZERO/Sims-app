import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import bgVideo from '../../assets/bg_video.mp4';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('student@suims.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token, user } = response.data;
      
      login(access_token, refresh_token, user);
      
      // Always route to the user's specific dashboard to avoid unauthorized bounces
      // if they logged out from a different role's page previously.
      navigate(`/${user.role.toLowerCase()}/dashboard`, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-slate-950">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity">
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
      
      <div className="glass-card w-full max-w-md p-8 relative z-10 backdrop-blur-xl border border-slate-700/50 shadow-2xl bg-slate-900/60">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-outfit font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            SUIMS
          </h1>
          <p className="text-slate-400 text-sm">Smart University Internship Management</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. student@suims.edu"
          />

          <Input
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
            Sign In
          </Button>

          <div className="text-center mt-4 pt-2">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Register here
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-center text-sm text-slate-400 mb-4 font-medium">Quick Login for Testing</p>
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="secondary" size="sm" onClick={() => handleQuickFill('admin@suims.edu', 'password123')}>Admin</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => handleQuickFill('student@suims.edu', 'password123')}>Student</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => handleQuickFill('lecturer@suims.edu', 'password123')}>Lecturer</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => handleQuickFill('company@suims.edu', 'password123')}>Company</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

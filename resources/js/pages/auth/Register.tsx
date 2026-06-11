import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import bgVideo from '../../assets/bg_video.mp4';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'STUDENT' | 'COMPANY'>('STUDENT');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    try {
      const names = formData.name.split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '-';

      await api.post('/auth/register', {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        password: formData.password,
        role: role,
        university_id: role === 'STUDENT' ? `UNV-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        company_name: formData.companyName
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Media & Ornaments */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity">
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-outfit font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            Join SUIMS
          </h1>
          <p className="text-slate-400">Create an account to get started.</p>
        </div>

        <div className="flex bg-slate-800/50 p-1 rounded-lg mb-6 border border-slate-700/50">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'STUDENT' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setRole('STUDENT')}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              role === 'COMPANY' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setRole('COMPANY')}
          >
            Company
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'COMPANY' && (
            <Input 
              label="Company Name"
              name="companyName"
              placeholder="Enter official company name"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          )}

          <Input 
            label="Full Name"
            name="name"
            placeholder={role === 'COMPANY' ? "Contact Person Name" : "John Doe"}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input 
            label="Email Address"
            type="email"
            name="email"
            placeholder={role === 'COMPANY' ? "hr@company.com" : "student@university.edu"}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input 
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input 
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" variant="primary" className="w-full !mt-6">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400 border-t border-slate-800/50 pt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

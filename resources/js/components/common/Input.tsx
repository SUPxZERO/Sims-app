import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1 transition-colors duration-200">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} focus:border-blue-400 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500 animate-slideUp">{error}</p>}
    </div>
  );
};

export default Input;

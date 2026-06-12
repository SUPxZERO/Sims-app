import React from 'react';

interface SkeletonProps {
  type?: 'text' | 'card' | 'avatar' | 'button' | 'input' | 'table-row';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'text',
  width = 'w-full',
  height = 'h-4',
  className = '',
  count = 1,
}) => {
  const baseClasses = 'bg-slate-800/50 rounded-lg animate-pulse';
  
  const typeClasses = {
    text: `${width} ${height}`,
    card: `${width} h-32`,
    avatar: 'w-10 h-10 rounded-full',
    button: `${width} h-10`,
    input: `${width} h-10`,
    'table-row': `${width} h-12`,
  };

  const skeletonClass = `${baseClasses} ${typeClasses[type]} ${className}`;

  if (count > 1) {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={skeletonClass} />
        ))}
      </div>
    );
  }

  return <div className={skeletonClass} />;
};

export default Skeleton;

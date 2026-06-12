import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  mediaType?: 'image' | 'video';
  mediaSrc?: string;
  heightClass?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  mediaType = 'image',
  mediaSrc,
  heightClass = 'min-h-[250px]',
  children
}) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 shadow-lg flex items-end ${heightClass}`}>
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {mediaSrc && mediaType === 'video' ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover object-center opacity-40 mix-blend-screen">
            <source src={mediaSrc} type="video/mp4" />
          </video>
        ) : mediaSrc ? (
          <img src={mediaSrc} alt={title} className="w-full h-full object-cover object-center opacity-40 mix-blend-screen" />
        ) : (
          <div className="w-full h-full bg-slate-800 opacity-40"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-4 animate-slideUp">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 font-outfit">{title}</h1>
          {subtitle && <p className="text-slate-400 text-lg max-w-2xl">{subtitle}</p>}
        </div>
        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

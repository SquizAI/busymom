import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'fuchsia', text = 'Loading...' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-t-2 border-b-2',
    xl: 'h-16 w-16 border-t-2 border-b-2'
  };
  
  // Color classes
  const colorClasses = {
    fuchsia: 'border-fuchsia-500',
    violet: 'border-violet-500',
    pink: 'border-pink-500',
    amber: 'border-amber-500',
    gray: 'border-gray-500'
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;

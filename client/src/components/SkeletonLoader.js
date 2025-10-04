import React from 'react';

const SkeletonLoader = ({ 
  type = 'text', 
  width = '100%', 
  height = '20px', 
  className = '',
  count = 1 
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div 
            className={`${baseClasses} ${className}`}
            style={{ width, height }}
          />
        );
      
      case 'card':
        return (
          <div className={`${baseClasses} p-4 ${className}`}>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className={`${baseClasses} ${className}`}>
            <div className="space-y-3">
              {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'avatar':
        return (
          <div 
            className={`${baseClasses} rounded-full ${className}`}
            style={{ width, height }}
          />
        );
      
      case 'button':
        return (
          <div 
            className={`${baseClasses} ${className}`}
            style={{ width, height }}
          />
        );
      
      default:
        return (
          <div 
            className={`${baseClasses} ${className}`}
            style={{ width, height }}
          />
        );
    }
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index}>
            {renderSkeleton()}
          </div>
        ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default SkeletonLoader;

import React from 'react';

/**
 * Componente de skeleton para loading dos cards
 */
const CardSkeleton = () => {
  return (
    <div className="card-base p-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>

      {/* Título skeleton */}
      <div className="mb-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Descrição skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Controles skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;


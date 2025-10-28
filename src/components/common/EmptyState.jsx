import React from 'react';

/**
 * Componente para exibir estado vazio
 */
const EmptyState = ({ 
  icon = '📋', 
  title = 'Nenhum item encontrado', 
  description = 'Não há itens para exibir no momento.',
  action = null 
}) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6">
        {description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;


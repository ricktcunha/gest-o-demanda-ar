import React from 'react';
import { motion } from 'framer-motion';
import CardItem from './CardItem';
import CardSkeleton from './CardSkeleton';

/**
 * Componente de lista de cards com grid responsivo
 */
const CardList = ({ cards, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma demanda encontrada
        </h3>
        <p className="text-gray-500">
          {cards.length === 0 
            ? 'Não há demandas para exibir no momento.'
            : 'Tente ajustar os filtros para encontrar mais resultados.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.05,
            ease: 'easeOut'
          }}
          whileHover={{ 
            y: -2,
            transition: { duration: 0.2 }
          }}
        >
          <CardItem card={card} />
        </motion.div>
      ))}
    </div>
  );
};

export default CardList;


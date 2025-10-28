import React from 'react';
import { useAppStore } from '../../contexts/AppContext';
import CardList from '../cards/CardList';

/**
 * Página principal de visualização de cards
 */
const CardsView = () => {
  const { 
    getFilteredCards, 
    isLoading, 
    activeTab, 
    getCardsByResponsible 
  } = useAppStore();

  // Filtra cards baseado na aba ativa
  const getCardsForActiveTab = () => {
    if (activeTab === 'overview') {
      return getFilteredCards();
    }
    
    const responsibleGroups = getCardsByResponsible();
    const activeGroup = responsibleGroups[activeTab];
    
    if (activeGroup) {
      return activeGroup.cards;
    }
    
    return [];
  };

  const cards = getCardsForActiveTab();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {activeTab === 'overview' ? '📊 Todas as Demandas' : '👤 Demandas do Responsável'}
        </h2>
        <p className="text-gray-600">
          {activeTab === 'overview' 
            ? 'Visualize todas as demandas organizadas por prazo'
            : 'Demandas atribuídas ao responsável selecionado'
          }
        </p>
      </div>

      {/* Lista de cards */}
      <CardList cards={cards} isLoading={isLoading} />
    </div>
  );
};

export default CardsView;


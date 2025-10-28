import { sortCardsByDueDate } from './dateFormatter';
import { CARD_STATUS } from './constants';

/**
 * Ordena cards por múltiplos critérios
 * @param {Array} cards - Array de cards
 * @param {string} sortBy - Critério de ordenação ('dueDate', 'status', 'priority', 'name')
 * @param {string} order - Ordem ('asc', 'desc')
 * @returns {Array} Cards ordenados
 */
export const sortCards = (cards, sortBy = 'dueDate', order = 'asc') => {
  if (!cards || cards.length === 0) return [];
  
  const sortedCards = [...cards];
  
  switch (sortBy) {
    case 'dueDate':
      return sortCardsByDueDate(sortedCards);
    
    case 'status':
      return sortedCards.sort((a, b) => {
        const statusOrder = {
          [CARD_STATUS.NOT_STARTED]: 0,
          [CARD_STATUS.IN_PROGRESS]: 1,
          [CARD_STATUS.CHANGE]: 2,
          [CARD_STATUS.COMPLETED]: 3,
        };
        
        const aOrder = statusOrder[a.localStatus] || 0;
        const bOrder = statusOrder[b.localStatus] || 0;
        
        return order === 'asc' ? aOrder - bOrder : bOrder - aOrder;
      });
    
    case 'priority':
      return sortedCards.sort((a, b) => {
        // Prioridade baseada em labels do Trello
        const getPriority = (card) => {
          if (!card.labels || card.labels.length === 0) return 0;
          
          const priorityLabels = card.labels.map(label => label.name.toLowerCase());
          
          if (priorityLabels.includes('urgente') || priorityLabels.includes('urgent')) return 3;
          if (priorityLabels.includes('alta') || priorityLabels.includes('high')) return 2;
          if (priorityLabels.includes('média') || priorityLabels.includes('medium')) return 1;
          if (priorityLabels.includes('baixa') || priorityLabels.includes('low')) return 0;
          
          return 0;
        };
        
        const aPriority = getPriority(a);
        const bPriority = getPriority(b);
        
        return order === 'asc' ? aPriority - bPriority : bPriority - aPriority;
      });
    
    case 'name':
      return sortedCards.sort((a, b) => {
        const aName = a.name?.toLowerCase() || '';
        const bName = b.name?.toLowerCase() || '';
        
        return order === 'asc' 
          ? aName.localeCompare(bName, 'pt-BR')
          : bName.localeCompare(aName, 'pt-BR');
      });
    
    case 'responsible':
      return sortedCards.sort((a, b) => {
        const aResponsible = a.responsible?.name?.toLowerCase() || '';
        const bResponsible = b.responsible?.name?.toLowerCase() || '';
        
        return order === 'asc'
          ? aResponsible.localeCompare(bResponsible, 'pt-BR')
          : bResponsible.localeCompare(aResponsible, 'pt-BR');
      });
    
    default:
      return sortCardsByDueDate(sortedCards);
  }
};

/**
 * Agrupa cards por responsável
 * @param {Array} cards - Array de cards
 * @returns {Object} Cards agrupados por responsável
 */
export const groupCardsByResponsible = (cards) => {
  if (!cards || cards.length === 0) return {};
  
  return cards.reduce((groups, card) => {
    const responsibleId = card.responsible?.id || 'unassigned';
    const responsibleName = card.responsible?.name || 'Sem responsável';
    
    if (!groups[responsibleId]) {
      groups[responsibleId] = {
        id: responsibleId,
        name: responsibleName,
        cards: [],
        count: 0,
      };
    }
    
    groups[responsibleId].cards.push(card);
    groups[responsibleId].count++;
    
    return groups;
  }, {});
};

/**
 * Agrupa cards por status
 * @param {Array} cards - Array de cards
 * @returns {Object} Cards agrupados por status
 */
export const groupCardsByStatus = (cards) => {
  if (!cards || cards.length === 0) return {};
  
  return cards.reduce((groups, card) => {
    const status = card.localStatus || CARD_STATUS.NOT_STARTED;
    
    if (!groups[status]) {
      groups[status] = {
        status,
        cards: [],
        count: 0,
      };
    }
    
    groups[status].cards.push(card);
    groups[status].count++;
    
    return groups;
  }, {});
};

/**
 * Agrupa cards por categoria/label
 * @param {Array} cards - Array de cards
 * @returns {Object} Cards agrupados por categoria
 */
export const groupCardsByCategory = (cards) => {
  if (!cards || cards.length === 0) return {};
  
  return cards.reduce((groups, card) => {
    if (!card.labels || card.labels.length === 0) {
      const category = 'Sem categoria';
      
      if (!groups[category]) {
        groups[category] = {
          name: category,
          color: '#9CA3AF',
          cards: [],
          count: 0,
        };
      }
      
      groups[category].cards.push(card);
      groups[category].count++;
    } else {
      card.labels.forEach(label => {
        const category = label.name;
        
        if (!groups[category]) {
          groups[category] = {
            name: category,
            color: label.color || '#9CA3AF',
            cards: [],
            count: 0,
          };
        }
        
        groups[category].cards.push(card);
        groups[category].count++;
      });
    }
    
    return groups;
  }, {});
};

/**
 * Retorna cards atrasados
 * @param {Array} cards - Array de cards
 * @returns {Array} Cards atrasados
 */
export const getOverdueCards = (cards) => {
  if (!cards || cards.length === 0) return [];
  
  const now = new Date();
  
  return cards.filter(card => {
    if (!card.due) return false;
    
    const dueDate = new Date(card.due);
    return dueDate < now && !isToday(dueDate);
  });
};

/**
 * Retorna cards que vencem hoje
 * @param {Array} cards - Array de cards
 * @returns {Array} Cards que vencem hoje
 */
export const getTodayCards = (cards) => {
  if (!cards || cards.length === 0) return [];
  
  return cards.filter(card => {
    if (!card.due) return false;
    
    const dueDate = new Date(card.due);
    return isToday(dueDate);
  });
};

/**
 * Retorna cards que vencem esta semana
 * @param {Array} cards - Array de cards
 * @returns {Array} Cards que vencem esta semana
 */
export const getThisWeekCards = (cards) => {
  if (!cards || cards.length === 0) return [];
  
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Segunda-feira
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo
  
  return cards.filter(card => {
    if (!card.due) return false;
    
    const dueDate = new Date(card.due);
    return dueDate >= startOfWeek && dueDate <= endOfWeek;
  });
};

/**
 * Retorna estatísticas dos cards
 * @param {Array} cards - Array de cards
 * @returns {Object} Estatísticas dos cards
 */
export const getCardsStats = (cards) => {
  if (!cards || cards.length === 0) {
    return {
      total: 0,
      byStatus: {},
      byResponsible: {},
      overdue: 0,
      today: 0,
      thisWeek: 0,
    };
  }
  
  const stats = {
    total: cards.length,
    byStatus: groupCardsByStatus(cards),
    byResponsible: groupCardsByResponsible(cards),
    overdue: getOverdueCards(cards).length,
    today: getTodayCards(cards).length,
    thisWeek: getThisWeekCards(cards).length,
  };
  
  return stats;
};


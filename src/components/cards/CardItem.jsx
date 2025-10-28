import React, { useState } from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';
import { useAppStore } from '../../contexts/AppContext';
import { CARD_STATUS_COLORS } from '../../utils/constants';
import { formatDate, getDueDateAlertText, getDueDateAlertColor, getDueDateIcon } from '../../utils/dateFormatter';
import StatusDropdown from './StatusDropdown';

/**
 * Componente de card individual
 */
const CardItem = ({ card }) => {
  const { updateCardStatus } = useAppStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await updateCardStatus(card.id, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTrelloClick = () => {
    window.open(card.url, '_blank');
  };

  // Determina as classes CSS baseadas no status
  const statusClasses = CARD_STATUS_COLORS[card.localStatus] || CARD_STATUS_COLORS[CARD_STATUS.NOT_STARTED];
  
  // Verifica se está atrasado
  const isOverdue = card.due && new Date(card.due) < new Date() && !isToday(new Date(card.due));
  
  // Classes do card
  const cardClasses = `
    card-base card-hover p-4 cursor-pointer
    ${statusClasses.bg} ${statusClasses.border}
    ${isOverdue ? 'status-overdue' : ''}
    ${isUpdating ? 'opacity-50 pointer-events-none' : ''}
  `;

  return (
    <div className={cardClasses}>
      {/* Header do card */}
      <div className="flex items-center justify-between mb-3">
        {/* Badge da categoria */}
        <div className="flex items-center space-x-2">
          {card.labels && card.labels.length > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
              {card.labels[0].name}
            </span>
          )}
        </div>

        {/* Badge de alerta de prazo */}
        {card.due && (
          <div className={`
            px-2 py-1 text-xs font-medium rounded-full
            ${getDueDateAlertColor(card.due)}
          `}>
            {getDueDateIcon(card.due)} {getDueDateAlertText(card.due)}
          </div>
        )}
      </div>

      {/* Corpo do card */}
      <div className="mb-4">
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {card.name}
        </h3>

        {/* Descrição */}
        {card.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {card.description}
          </p>
        )}
      </div>

      {/* Footer do card */}
      <div className="flex items-center justify-between">
        {/* Data de vencimento */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {card.due ? formatDate(card.due) : 'Sem prazo'}
          </span>
        </div>

        {/* Responsável */}
        {card.responsible && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>{card.responsible.name}</span>
          </div>
        )}
      </div>

      {/* Controles do card */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        {/* Dropdown de status */}
        <StatusDropdown
          currentStatus={card.localStatus}
          onStatusChange={handleStatusChange}
          disabled={isUpdating}
        />

        {/* Botão para ver no Trello */}
        <button
          onClick={handleTrelloClick}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Ver no Trello</span>
        </button>
      </div>
    </div>
  );
};

// Helper para verificar se é hoje
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

export default CardItem;


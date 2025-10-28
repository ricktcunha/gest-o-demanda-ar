import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CARD_STATUS, CARD_STATUS_LABELS, CARD_STATUS_COLORS } from '../../utils/constants';

/**
 * Componente de dropdown para seleção de status
 */
const StatusDropdown = ({ currentStatus, onStatusChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusSelect = (status) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  const currentStatusInfo = CARD_STATUS_COLORS[currentStatus] || CARD_STATUS_COLORS[CARD_STATUS.NOT_STARTED];
  const currentStatusLabel = CARD_STATUS_LABELS[currentStatus] || CARD_STATUS_LABELS[CARD_STATUS.NOT_STARTED];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
          ${currentStatusInfo.border} ${currentStatusInfo.bg}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
        `}
      >
        <span className="text-sm">{currentStatusInfo.icon}</span>
        <span className="text-sm">{currentStatusLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {Object.values(CARD_STATUS).map((status) => {
            const statusInfo = CARD_STATUS_COLORS[status];
            const statusLabel = CARD_STATUS_LABELS[status];
            const isSelected = status === currentStatus;

            return (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 text-sm transition-colors duration-200
                  ${isSelected 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{statusInfo.icon}</span>
                  <span>{statusLabel}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;


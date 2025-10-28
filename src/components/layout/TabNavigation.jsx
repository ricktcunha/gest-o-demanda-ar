import React, { useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';
import { useAppStore } from '../../contexts/AppContext';

/**
 * Componente de navegação por abas (responsáveis)
 */
const TabNavigation = () => {
  const {
    activeTab,
    setActiveTab,
    members,
    getCardsByResponsible,
  } = useAppStore();

  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const responsibleGroups = getCardsByResponsible();
  const maxVisibleTabs = 6;

  // Prepara as abas
  const tabs = [
    {
      id: 'overview',
      name: 'Visão Geral',
      icon: '📊',
      count: Object.values(responsibleGroups).reduce((total, group) => total + group.count, 0),
    },
    ...Object.values(responsibleGroups).map(group => ({
      id: group.id,
      name: group.name,
      icon: '👤',
      count: group.count,
    })),
  ];

  const visibleTabs = tabs.slice(0, maxVisibleTabs);
  const hiddenTabs = tabs.slice(maxVisibleTabs);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setShowMoreDropdown(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Abas principais */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'tab-active'
                    : 'tab-inactive'
                  }
                `}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full font-medium
                    ${activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dropdown "Mais" para abas extras */}
          {hiddenTabs.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className="flex items-center space-x-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent transition-all duration-200"
              >
                <span>Mais</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMoreDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {showMoreDropdown && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Mais responsáveis
                  </div>
                  {hiddenTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{tab.icon}</span>
                        <span>{tab.name}</span>
                      </div>
                      {tab.count > 0 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Overlay para fechar dropdown */}
      {showMoreDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowMoreDropdown(false)}
        />
      )}
    </nav>
  );
};

export default TabNavigation;


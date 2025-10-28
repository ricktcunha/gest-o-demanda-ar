import React, { useState } from 'react';
import { Search, Filter, Download, X } from 'lucide-react';
import { useAppStore } from '../../contexts/AppContext';
import { CARD_STATUS, CARD_STATUS_LABELS, DUE_DATE_FILTERS } from '../../utils/constants';

/**
 * Componente de filtros e busca
 */
const FilterBar = () => {
  const {
    filters,
    setFilters,
    clearFilters,
    labels,
    members,
    getFilteredCards,
  } = useAppStore();

  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  const filteredCards = getFilteredCards();
  const totalCards = useAppStore(state => state.cards.length);

  // Debounce para busca
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ ...filters, search: searchValue });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleStatusFilter = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    setFilters({ ...filters, status: newStatus });
  };

  const handleCategoryFilter = (category) => {
    const newCategory = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    
    setFilters({ ...filters, category: newCategory });
  };

  const handleDueDateFilter = (dueDate) => {
    const newDueDate = filters.dueDate.includes(dueDate)
      ? filters.dueDate.filter(d => d !== dueDate)
      : [...filters.dueDate, dueDate];
    
    setFilters({ ...filters, dueDate: newDueDate });
  };

  const handleResponsibleFilter = (responsibleId) => {
    const newResponsible = filters.responsible.includes(responsibleId)
      ? filters.responsible.filter(r => r !== responsibleId)
      : [...filters.responsible, responsibleId];
    
    setFilters({ ...filters, responsible: newResponsible });
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: [],
      category: [],
      dueDate: [],
      responsible: [],
    });
    setSearchValue('');
  };

  const handleExport = () => {
    // TODO: Implementar exportação
    console.log('Exportar dados...');
  };

  const hasActiveFilters = Object.values(filters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : filter !== ''
  );

  return (
    <div className="bg-white border-b border-gray-200 sticky top-32 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Busca */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar demandas..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-3">
            {/* Botão de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
                ${showFilters || hasActiveFilters
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                  {Object.values(filters).reduce((total, filter) => 
                    total + (Array.isArray(filter) ? filter.length : (filter !== '' ? 1 : 0)), 0
                  )}
                </span>
              )}
            </button>

            {/* Botão de exportar */}
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* Contador de resultados */}
            <div className="text-sm text-gray-500">
              Mostrando {filteredCards.length} de {totalCards} demandas
            </div>
          </div>
        </div>

        {/* Painel de filtros expandido */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {Object.values(CARD_STATUS).map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => handleStatusFilter(status)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {CARD_STATUS_LABELS[status]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro por Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {labels.map(label => (
                    <label key={label.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(label.name)}
                        onChange={() => handleCategoryFilter(label.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {label.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro por Prazo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo
                </label>
                <div className="space-y-2">
                  {Object.entries(DUE_DATE_FILTERS).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.dueDate.includes(value)}
                        onChange={() => handleDueDateFilter(value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {key === 'OVERDUE' ? 'Atrasadas' :
                         key === 'TODAY' ? 'Hoje' :
                         key === 'THIS_WEEK' ? 'Esta semana' :
                         key === 'THIS_MONTH' ? 'Este mês' :
                         key === 'NEXT_MONTH' ? 'Próximo mês' :
                         'Sem prazo'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filtro por Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {members.map(member => (
                    <label key={member.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.responsible.includes(member.id)}
                        onChange={() => handleResponsibleFilter(member.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {member.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Limpar filtros</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;


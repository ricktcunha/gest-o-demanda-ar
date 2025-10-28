import { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

/**
 * Hook para gerenciar filtros e busca
 */
export const useFilters = (cards) => {
  const [filters, setFilters] = useState({
    search: '',
    status: [],
    category: [],
    dueDate: [],
    responsible: [],
  });

  // Debounced search para melhor performance
  const debouncedSetSearch = useCallback(
    debounce((search) => {
      setFilters(prev => ({ ...prev, search }));
    }, 300),
    []
  );

  // Atualiza filtro de busca
  const setSearch = useCallback((search) => {
    setFilters(prev => ({ ...prev, search }));
    debouncedSetSearch(search);
  }, [debouncedSetSearch]);

  // Atualiza filtro de status
  const setStatusFilter = useCallback((status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  }, []);

  // Atualiza filtro de categoria
  const setCategoryFilter = useCallback((category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  }, []);

  // Atualiza filtro de data de vencimento
  const setDueDateFilter = useCallback((dueDate) => {
    setFilters(prev => ({
      ...prev,
      dueDate: prev.dueDate.includes(dueDate)
        ? prev.dueDate.filter(d => d !== dueDate)
        : [...prev.dueDate, dueDate]
    }));
  }, []);

  // Atualiza filtro de responsável
  const setResponsibleFilter = useCallback((responsibleId) => {
    setFilters(prev => ({
      ...prev,
      responsible: prev.responsible.includes(responsibleId)
        ? prev.responsible.filter(r => r !== responsibleId)
        : [...prev.responsible, responsibleId]
    }));
  }, []);

  // Limpa todos os filtros
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: [],
      category: [],
      dueDate: [],
      responsible: [],
    });
  }, []);

  // Filtra cards baseado nos filtros ativos
  const filteredCards = useMemo(() => {
    if (!cards || cards.length === 0) return [];

    let filtered = [...cards];

    // Filtro por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm) ||
        card.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por status
    if (filters.status.length > 0) {
      filtered = filtered.filter(card =>
        filters.status.includes(card.localStatus)
      );
    }

    // Filtro por categoria
    if (filters.category.length > 0) {
      filtered = filtered.filter(card =>
        card.labels.some(label =>
          filters.category.includes(label.name)
        )
      );
    }

    // Filtro por responsável
    if (filters.responsible.length > 0) {
      filtered = filtered.filter(card =>
        card.responsible && filters.responsible.includes(card.responsible.id)
      );
    }

    // Filtro por data de vencimento
    if (filters.dueDate.length > 0) {
      filtered = filtered.filter(card => {
        if (filters.dueDate.includes('sem-prazo')) {
          return !card.due;
        }
        
        if (!card.due) return false;
        
        const dueDate = new Date(card.due);
        const now = new Date();
        
        if (filters.dueDate.includes('atrasadas')) {
          return dueDate < now && !isToday(dueDate);
        }
        
        if (filters.dueDate.includes('hoje')) {
          return isToday(dueDate);
        }
        
        if (filters.dueDate.includes('esta-semana')) {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay() + 1);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return dueDate >= startOfWeek && dueDate <= endOfWeek;
        }
        
        return true;
      });
    }

    return filtered;
  }, [cards, filters]);

  // Verifica se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(filter => 
      Array.isArray(filter) ? filter.length > 0 : filter !== ''
    );
  }, [filters]);

  // Conta filtros ativos
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((total, filter) => 
      total + (Array.isArray(filter) ? filter.length : (filter !== '' ? 1 : 0)), 0
    );
  }, [filters]);

  return {
    filters,
    filteredCards,
    hasActiveFilters,
    activeFiltersCount,
    setSearch,
    setStatusFilter,
    setCategoryFilter,
    setDueDateFilter,
    setResponsibleFilter,
    clearFilters,
    setFilters,
  };
};

// Helper para verificar se é hoje
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}


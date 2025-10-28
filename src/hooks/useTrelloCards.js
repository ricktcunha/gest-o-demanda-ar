import { useState, useEffect, useCallback } from 'react';
import { trelloService } from '../services/trelloService';
import { storageService } from '../services/storageService';
import { toast } from 'react-hot-toast';

/**
 * Hook para gerenciar cards do Trello
 */
export const useTrelloCards = (boardId) => {
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [labels, setLabels] = useState([]);
  const [boardInfo, setBoardInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  // Carrega dados do cache local se disponível
  const loadFromCache = useCallback(() => {
    if (!boardId) return;
    
    const cache = storageService.getTrelloCache(boardId);
    if (cache && storageService.isCacheValid(boardId)) {
      setCards(cache.cards || []);
      setMembers(cache.members || []);
      setLabels(cache.labels || []);
      setLastSync(cache.cachedAt);
    }
  }, [boardId]);

  // Sincroniza dados com o Trello
  const syncData = useCallback(async (force = false) => {
    if (!boardId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Verifica se deve usar cache
      if (!force && storageService.isCacheValid(boardId)) {
        loadFromCache();
        setIsLoading(false);
        return;
      }
      
      // Busca dados do Trello
      const [cardsData, membersData, labelsData, boardData] = await Promise.all([
        trelloService.getBoardCards(boardId),
        trelloService.getBoardMembers(boardId),
        trelloService.getBoardLabels(boardId),
        trelloService.getBoardInfo(boardId),
      ]);
      
      // Atualiza estado
      setCards(cardsData);
      setMembers(membersData);
      setLabels(labelsData);
      setBoardInfo(boardData);
      setLastSync(new Date().toISOString());
      
      // Salva no cache
      storageService.saveTrelloCache(boardId, cardsData, membersData, labelsData);
      
    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      setError(error.message);
      
      // Tenta carregar do cache em caso de erro
      loadFromCache();
      
      toast.error(error.message || 'Erro ao sincronizar dados');
    } finally {
      setIsLoading(false);
    }
  }, [boardId, loadFromCache]);

  // Sincronização inicial
  useEffect(() => {
    if (boardId) {
      syncData();
    }
  }, [boardId, syncData]);

  // Sincronização automática
  useEffect(() => {
    if (!boardId) return;
    
    const interval = setInterval(() => {
      syncData();
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [boardId, syncData]);

  return {
    cards,
    members,
    labels,
    boardInfo,
    isLoading,
    error,
    lastSync,
    syncData,
    clearError: () => setError(null),
  };
};


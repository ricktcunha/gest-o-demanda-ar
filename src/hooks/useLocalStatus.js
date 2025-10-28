import { useState, useEffect, useCallback } from 'react';
import { firestoreService } from '../services/firestoreService';
import { storageService } from '../services/storageService';
import { CARD_STATUS } from '../utils/constants';
import { toast } from 'react-hot-toast';

/**
 * Hook para gerenciar status locais dos cards
 */
export const useLocalStatus = (workspaceId) => {
  const [cardStatuses, setCardStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega status dos cards
  const loadCardStatuses = useCallback(async () => {
    if (!workspaceId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let statuses = {};
      
      // Tenta carregar do Firestore primeiro
      if (firestoreService.isConfigured()) {
        statuses = await firestoreService.getAllCardStatuses(workspaceId);
      } else {
        // Fallback para localStorage
        statuses = storageService.getAllCardStatuses(workspaceId);
      }
      
      setCardStatuses(statuses);
    } catch (error) {
      console.error('Erro ao carregar status dos cards:', error);
      setError(error.message);
      
      // Fallback para localStorage
      const statuses = storageService.getAllCardStatuses(workspaceId);
      setCardStatuses(statuses);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  // Atualiza status de um card
  const updateCardStatus = useCallback(async (cardId, newStatus, notes = '') => {
    if (!workspaceId) return;
    
    const userId = 'current-user'; // TODO: Implementar autenticação
    
    try {
      const oldStatus = cardStatuses[cardId]?.status || CARD_STATUS.NOT_STARTED;
      
      // Atualiza no Firestore ou localStorage
      if (firestoreService.isConfigured()) {
        await firestoreService.saveCardStatus(workspaceId, cardId, newStatus, userId, notes);
        await firestoreService.saveStatusHistory(workspaceId, cardId, oldStatus, newStatus, userId);
      } else {
        storageService.saveCardStatus(workspaceId, cardId, newStatus, userId, notes);
        storageService.saveStatusHistory(workspaceId, cardId, oldStatus, newStatus, userId);
      }
      
      // Atualiza estado local
      setCardStatuses(prev => ({
        ...prev,
        [cardId]: {
          status: newStatus,
          lastUpdated: new Date().toISOString(),
          updatedBy: userId,
          notes,
        },
      }));
      
      toast.success('Status atualizado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao atualizar status do card:', error);
      toast.error('Erro ao atualizar status');
      throw error;
    }
  }, [workspaceId, cardStatuses]);

  // Busca status de um card específico
  const getCardStatus = useCallback((cardId) => {
    return cardStatuses[cardId] || { status: CARD_STATUS.NOT_STARTED };
  }, [cardStatuses]);

  // Remove status de um card
  const removeCardStatus = useCallback(async (cardId) => {
    if (!workspaceId) return;
    
    try {
      if (firestoreService.isConfigured()) {
        await firestoreService.removeCard(workspaceId, cardId);
      } else {
        storageService.removeCard(workspaceId, cardId);
      }
      
      setCardStatuses(prev => {
        const newStatuses = { ...prev };
        delete newStatuses[cardId];
        return newStatuses;
      });
      
    } catch (error) {
      console.error('Erro ao remover status do card:', error);
      throw error;
    }
  }, [workspaceId]);

  // Carrega status inicial
  useEffect(() => {
    if (workspaceId) {
      loadCardStatuses();
    }
  }, [workspaceId, loadCardStatuses]);

  return {
    cardStatuses,
    isLoading,
    error,
    updateCardStatus,
    getCardStatus,
    removeCardStatus,
    loadCardStatuses,
    clearError: () => setError(null),
  };
};


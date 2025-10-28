import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { trelloService } from '../services/trelloService';
import { firestoreService } from '../services/firestoreService';
import { storageService } from '../services/storageService';
import { sortCards, getCardsStats } from '../utils/sortCards';
import { CARD_STATUS, APP_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

/**
 * Store global da aplicação usando Zustand
 */
export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        cards: [],
        members: [],
        labels: [],
        boardInfo: null,
        isLoading: false,
        isSyncing: false,
        lastSync: null,
        error: null,
        currentWorkspace: null,
        currentUser: null,
        filters: {
          search: '',
          status: [],
          category: [],
          dueDate: [],
          responsible: [],
        },
        sortBy: 'dueDate',
        sortOrder: 'asc',
        activeTab: 'overview',
        cardStatuses: {},
        syncInterval: null,

        // Actions
        setLoading: (loading) => set({ isLoading: loading }),
        
        setError: (error) => set({ error }),
        
        clearError: () => set({ error: null }),
        
        setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
        
        setCurrentUser: (user) => set({ currentUser: user }),
        
        setActiveTab: (tab) => set({ activeTab: tab }),
        
        setSortBy: (sortBy) => set({ sortBy }),
        
        setSortOrder: (order) => set({ sortOrder: order }),
        
        setFilters: (filters) => set({ filters }),
        
        clearFilters: () => set({
          filters: {
            search: '',
            status: [],
            category: [],
            dueDate: [],
            responsible: [],
          }
        }),

        // Sincronização com Trello
        syncWithTrello: async (boardId, force = false) => {
          const state = get();
          
          // Verifica se já está sincronizando
          if (state.isSyncing && !force) {
            return;
          }
          
          set({ isSyncing: true, error: null });
          
          try {
            // Verifica se o Trello está configurado
            if (!trelloService.isConfigured()) {
              throw new Error('Trello não está configurado. Verifique as variáveis de ambiente.');
            }
            
            // Busca dados do Trello
            const [cards, members, labels, boardInfo] = await Promise.all([
              trelloService.getBoardCards(boardId),
              trelloService.getBoardMembers(boardId),
              trelloService.getBoardLabels(boardId),
              trelloService.getBoardInfo(boardId),
            ]);
            
            // Busca status locais
            const cardStatuses = await get().loadCardStatuses(boardId);
            
            // Aplica status locais aos cards
            const cardsWithStatus = cards.map(card => ({
              ...card,
              localStatus: cardStatuses[card.id]?.status || CARD_STATUS.NOT_STARTED,
            }));
            
            // Atualiza estado
            set({
              cards: cardsWithStatus,
              members,
              labels,
              boardInfo,
              cardStatuses,
              lastSync: new Date().toISOString(),
              isSyncing: false,
            });
            
            // Salva cache local
            storageService.saveTrelloCache(boardId, cardsWithStatus, members, labels);
            
            return true;
          } catch (error) {
            console.error('Erro na sincronização:', error);
            set({
              error: error.message || ERROR_MESSAGES.SYNC_FAILED,
              isSyncing: false,
            });
            throw error;
          }
        },

        // Carrega status dos cards
        loadCardStatuses: async (workspaceId) => {
          try {
            let cardStatuses = {};
            
            // Tenta carregar do Firestore primeiro
            if (firestoreService.isConfigured()) {
              cardStatuses = await firestoreService.getAllCardStatuses(workspaceId);
            } else {
              // Fallback para localStorage
              cardStatuses = storageService.getAllCardStatuses(workspaceId);
            }
            
            set({ cardStatuses });
            return cardStatuses;
          } catch (error) {
            console.error('Erro ao carregar status dos cards:', error);
            // Fallback para localStorage
            const cardStatuses = storageService.getAllCardStatuses(workspaceId);
            set({ cardStatuses });
            return cardStatuses;
          }
        },

        // Atualiza status de um card
        updateCardStatus: async (cardId, newStatus, notes = '') => {
          const state = get();
          const workspaceId = state.currentWorkspace?.id;
          const userId = state.currentUser?.id || 'anonymous';
          
          if (!workspaceId) {
            throw new Error('Workspace não encontrado');
          }
          
          try {
            const oldStatus = state.cardStatuses[cardId]?.status || CARD_STATUS.NOT_STARTED;
            
            // Atualiza no Firestore ou localStorage
            if (firestoreService.isConfigured()) {
              await firestoreService.saveCardStatus(workspaceId, cardId, newStatus, userId, notes);
              await firestoreService.saveStatusHistory(workspaceId, cardId, oldStatus, newStatus, userId);
            } else {
              storageService.saveCardStatus(workspaceId, cardId, newStatus, userId, notes);
              storageService.saveStatusHistory(workspaceId, cardId, oldStatus, newStatus, userId);
            }
            
            // Atualiza estado local
            const newCardStatuses = {
              ...state.cardStatuses,
              [cardId]: {
                status: newStatus,
                lastUpdated: new Date().toISOString(),
                updatedBy: userId,
                notes,
              },
            };
            
            set({ cardStatuses: newCardStatuses });
            
            // Atualiza o card na lista
            const updatedCards = state.cards.map(card =>
              card.id === cardId ? { ...card, localStatus: newStatus } : card
            );
            
            set({ cards: updatedCards });
            
            return true;
          } catch (error) {
            console.error('Erro ao atualizar status do card:', error);
            throw error;
          }
        },

        // Filtra cards baseado nos filtros ativos
        getFilteredCards: () => {
          const state = get();
          let filteredCards = [...state.cards];
          
          // Filtro por busca
          if (state.filters.search) {
            const searchTerm = state.filters.search.toLowerCase();
            filteredCards = filteredCards.filter(card =>
              card.name.toLowerCase().includes(searchTerm) ||
              card.description.toLowerCase().includes(searchTerm)
            );
          }
          
          // Filtro por status
          if (state.filters.status.length > 0) {
            filteredCards = filteredCards.filter(card =>
              state.filters.status.includes(card.localStatus)
            );
          }
          
          // Filtro por categoria
          if (state.filters.category.length > 0) {
            filteredCards = filteredCards.filter(card =>
              card.labels.some(label =>
                state.filters.category.includes(label.name)
              )
            );
          }
          
          // Filtro por responsável
          if (state.filters.responsible.length > 0) {
            filteredCards = filteredCards.filter(card =>
              card.responsible && state.filters.responsible.includes(card.responsible.id)
            );
          }
          
          // Filtro por data de vencimento
          if (state.filters.dueDate.length > 0) {
            filteredCards = filteredCards.filter(card => {
              if (state.filters.dueDate.includes('sem-prazo')) {
                return !card.due;
              }
              
              if (!card.due) return false;
              
              const dueDate = new Date(card.due);
              const now = new Date();
              
              if (state.filters.dueDate.includes('atrasadas')) {
                return dueDate < now && !isToday(dueDate);
              }
              
              if (state.filters.dueDate.includes('hoje')) {
                return isToday(dueDate);
              }
              
              if (state.filters.dueDate.includes('esta-semana')) {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + 1);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return dueDate >= startOfWeek && dueDate <= endOfWeek;
              }
              
              return true;
            });
          }
          
          // Ordena os cards
          return sortCards(filteredCards, state.sortBy, state.sortOrder);
        },

        // Retorna estatísticas dos cards
        getCardsStats: () => {
          const state = get();
          return getCardsStats(state.cards);
        },

        // Retorna cards agrupados por responsável
        getCardsByResponsible: () => {
          const state = get();
          const filteredCards = get().getFilteredCards();
          
          return filteredCards.reduce((groups, card) => {
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
        },

        // Inicia sincronização automática
        startAutoSync: (boardId) => {
          const state = get();
          
          // Para sincronização anterior se existir
          if (state.syncInterval) {
            clearInterval(state.syncInterval);
          }
          
          // Inicia nova sincronização
          const interval = setInterval(() => {
            get().syncWithTrello(boardId);
          }, APP_CONFIG.SYNC_INTERVAL);
          
          set({ syncInterval: interval });
        },

        // Para sincronização automática
        stopAutoSync: () => {
          const state = get();
          
          if (state.syncInterval) {
            clearInterval(state.syncInterval);
            set({ syncInterval: null });
          }
        },

        // Limpa todos os dados
        clearData: () => {
          set({
            cards: [],
            members: [],
            labels: [],
            boardInfo: null,
            cardStatuses: {},
            lastSync: null,
            error: null,
          });
          
          // Para sincronização automática
          get().stopAutoSync();
        },
      }),
      {
        name: 'gestao-demandas-store',
        partialize: (state) => ({
          currentWorkspace: state.currentWorkspace,
          currentUser: state.currentUser,
          filters: state.filters,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          activeTab: state.activeTab,
        }),
      }
    ),
    {
      name: 'gestao-demandas-store',
    }
  )
);

// Helper para verificar se é hoje
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}


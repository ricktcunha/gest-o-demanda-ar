import { CARD_STATUS } from '../utils/constants';

/**
 * Serviço para armazenamento local (localStorage) como fallback
 */
class StorageService {
  constructor() {
    this.storageKey = 'gestao-demandas';
    this.cacheKey = 'gestao-demandas-cache';
  }

  /**
   * Salva dados no localStorage
   * @param {string} key - Chave para armazenar
   * @param {any} data - Dados a serem salvos
   */
  save(key, data) {
    try {
      const fullKey = `${this.storageKey}-${key}`;
      localStorage.setItem(fullKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  /**
   * Carrega dados do localStorage
   * @param {string} key - Chave para carregar
   * @param {any} defaultValue - Valor padrão se não encontrar
   * @returns {any} Dados carregados ou valor padrão
   */
  load(key, defaultValue = null) {
    try {
      const fullKey = `${this.storageKey}-${key}`;
      const data = localStorage.getItem(fullKey);
      
      if (data === null) {
        return defaultValue;
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove dados do localStorage
   * @param {string} key - Chave para remover
   */
  remove(key) {
    try {
      const fullKey = `${this.storageKey}-${key}`;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  }

  /**
   * Limpa todos os dados do aplicativo do localStorage
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storageKey)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }

  /**
   * Salva o status local de um card
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @param {string} status - Status local
   * @param {string} userId - ID do usuário que fez a alteração
   * @param {string} notes - Notas adicionais (opcional)
   */
  saveCardStatus(workspaceId, cardId, status, userId, notes = '') {
    const key = `card-status-${workspaceId}`;
    const cardStatuses = this.load(key, {});
    
    cardStatuses[cardId] = {
      status,
      lastUpdated: new Date().toISOString(),
      updatedBy: userId,
      notes,
    };
    
    return this.save(key, cardStatuses);
  }

  /**
   * Busca o status local de um card
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @returns {Object|null} Status do card ou null se não encontrado
   */
  getCardStatus(workspaceId, cardId) {
    const key = `card-status-${workspaceId}`;
    const cardStatuses = this.load(key, {});
    
    return cardStatuses[cardId] || null;
  }

  /**
   * Busca todos os status de cards de um workspace
   * @param {string} workspaceId - ID do workspace
   * @returns {Object} Objeto com status de todos os cards
   */
  getAllCardStatuses(workspaceId) {
    const key = `card-status-${workspaceId}`;
    return this.load(key, {});
  }

  /**
   * Salva informações do workspace
   * @param {string} workspaceId - ID do workspace
   * @param {Object} workspaceData - Dados do workspace
   */
  saveWorkspace(workspaceId, workspaceData) {
    const key = `workspace-${workspaceId}`;
    const data = {
      ...workspaceData,
      lastUpdated: new Date().toISOString(),
    };
    
    return this.save(key, data);
  }

  /**
   * Busca informações do workspace
   * @param {string} workspaceId - ID do workspace
   * @returns {Object|null} Dados do workspace ou null se não encontrado
   */
  getWorkspace(workspaceId) {
    const key = `workspace-${workspaceId}`;
    return this.load(key, null);
  }

  /**
   * Salva informações do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} userData - Dados do usuário
   */
  saveUser(userId, userData) {
    const key = `user-${userId}`;
    const data = {
      ...userData,
      lastUpdated: new Date().toISOString(),
    };
    
    return this.save(key, data);
  }

  /**
   * Busca informações do usuário
   * @param {string} userId - ID do usuário
   * @returns {Object|null} Dados do usuário ou null se não encontrado
   */
  getUser(userId) {
    const key = `user-${userId}`;
    return this.load(key, null);
  }

  /**
   * Salva cache de dados do Trello
   * @param {string} workspaceId - ID do workspace
   * @param {Array} cards - Array de cards
   * @param {Array} members - Array de membros
   * @param {Array} labels - Array de labels
   */
  saveTrelloCache(workspaceId, cards, members, labels) {
    const key = `trello-cache-${workspaceId}`;
    const data = {
      cards,
      members,
      labels,
      cachedAt: new Date().toISOString(),
    };
    
    return this.save(key, data);
  }

  /**
   * Busca cache de dados do Trello
   * @param {string} workspaceId - ID do workspace
   * @returns {Object|null} Dados em cache ou null se não encontrado
   */
  getTrelloCache(workspaceId) {
    const key = `trello-cache-${workspaceId}`;
    return this.load(key, null);
  }

  /**
   * Verifica se o cache ainda é válido
   * @param {string} workspaceId - ID do workspace
   * @param {number} ttl - Tempo de vida do cache em milissegundos
   * @returns {boolean} Se o cache é válido
   */
  isCacheValid(workspaceId, ttl = 5 * 60 * 1000) {
    const cache = this.getTrelloCache(workspaceId);
    
    if (!cache || !cache.cachedAt) {
      return false;
    }
    
    const cachedAt = new Date(cache.cachedAt);
    const now = new Date();
    
    return (now - cachedAt) < ttl;
  }

  /**
   * Salva configurações do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} settings - Configurações
   */
  saveUserSettings(userId, settings) {
    const key = `user-settings-${userId}`;
    return this.save(key, settings);
  }

  /**
   * Busca configurações do usuário
   * @param {string} userId - ID do usuário
   * @returns {Object} Configurações do usuário
   */
  getUserSettings(userId) {
    const key = `user-settings-${userId}`;
    return this.load(key, {
      theme: 'light',
      syncInterval: 5,
      notifications: true,
      defaultView: 'overview',
    });
  }

  /**
   * Salva histórico de mudanças de status
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @param {string} oldStatus - Status anterior
   * @param {string} newStatus - Novo status
   * @param {string} userId - ID do usuário que fez a alteração
   */
  saveStatusHistory(workspaceId, cardId, oldStatus, newStatus, userId) {
    const key = `card-history-${workspaceId}-${cardId}`;
    const history = this.load(key, []);
    
    const historyEntry = {
      oldStatus,
      newStatus,
      changedBy: userId,
      changedAt: new Date().toISOString(),
    };
    
    history.unshift(historyEntry);
    
    // Manter apenas os últimos 50 registros
    if (history.length > 50) {
      history.splice(50);
    }
    
    return this.save(key, history);
  }

  /**
   * Busca histórico de mudanças de um card
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @returns {Array} Array com histórico de mudanças
   */
  getCardHistory(workspaceId, cardId) {
    const key = `card-history-${workspaceId}-${cardId}`;
    return this.load(key, []);
  }

  /**
   * Remove dados de um card (quando removido do Trello)
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   */
  removeCard(workspaceId, cardId) {
    const statusKey = `card-status-${workspaceId}`;
    const historyKey = `card-history-${workspaceId}-${cardId}`;
    
    const cardStatuses = this.load(statusKey, {});
    delete cardStatuses[cardId];
    this.save(statusKey, cardStatuses);
    
    this.remove(historyKey);
    
    return true;
  }

  /**
   * Verifica se o localStorage está disponível
   */
  isAvailable() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retorna o tamanho usado pelo localStorage
   */
  getStorageSize() {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      return 0;
    }
  }
}

// Exporta uma instância singleton
export const storageService = new StorageService();
export default storageService;


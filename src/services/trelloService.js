import axios from 'axios';

// Configuração da API do Trello
const TRELLO_CONFIG = {
  baseURL: 'https://api.trello.com/1',
  apiKey: import.meta.env.VITE_TRELLO_API_KEY,
  token: import.meta.env.VITE_TRELLO_TOKEN,
  boardId: import.meta.env.VITE_TRELLO_BOARD_ID,
};

// Função para construir URLs da API
const buildTrelloURL = (endpoint, params = {}) => {
  const baseParams = {
    key: TRELLO_CONFIG.apiKey,
    token: TRELLO_CONFIG.token,
    ...params,
  };
  
  const queryString = new URLSearchParams(baseParams).toString();
  return `${TRELLO_CONFIG.baseURL}${endpoint}?${queryString}`;
};

// Serviço do Trello
export const trelloService = {
  // Verificar se as credenciais estão configuradas
  isConfigured: () => {
    return !!(TRELLO_CONFIG.apiKey && TRELLO_CONFIG.token && TRELLO_CONFIG.boardId);
  },

  // Obter informações do quadro
  getBoard: async () => {
    if (!trelloService.isConfigured()) {
      throw new Error('Credenciais do Trello não configuradas');
    }

    try {
      const url = buildTrelloURL(`/boards/${TRELLO_CONFIG.boardId}`);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter quadro:', error);
      throw error;
    }
  },

  // Obter cards do quadro
  getCards: async () => {
    if (!trelloService.isConfigured()) {
      throw new Error('Credenciais do Trello não configuradas');
    }

    try {
      const url = buildTrelloURL(`/boards/${TRELLO_CONFIG.boardId}/cards`, {
        fields: 'id,name,desc,due,dateLastActivity,url',
        members: 'true',
        member_fields: 'id,fullName,username',
        labels: 'true',
        checklists: 'true',
      });
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter cards:', error);
      throw error;
    }
  },

  // Obter membros do quadro
  getMembers: async () => {
    if (!trelloService.isConfigured()) {
      throw new Error('Credenciais do Trello não configuradas');
    }

    try {
      const url = buildTrelloURL(`/boards/${TRELLO_CONFIG.boardId}/members`);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter membros:', error);
      throw error;
    }
  },

  // Obter labels do quadro
  getLabels: async () => {
    if (!trelloService.isConfigured()) {
      throw new Error('Credenciais do Trello não configuradas');
    }

    try {
      const url = buildTrelloURL(`/boards/${TRELLO_CONFIG.boardId}/labels`);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter labels:', error);
      throw error;
    }
  },

  // Sincronizar todos os dados
  syncAll: async () => {
    if (!trelloService.isConfigured()) {
      throw new Error('Credenciais do Trello não configuradas');
    }

    try {
      const [board, cards, members, labels] = await Promise.all([
        trelloService.getBoard(),
        trelloService.getCards(),
        trelloService.getMembers(),
        trelloService.getLabels(),
      ]);

      return {
        board,
        cards,
        members,
        labels,
        lastSync: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Erro na sincronização:', error);
      throw error;
    }
  },
};

export default trelloService;
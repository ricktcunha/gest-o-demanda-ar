import axios from 'axios';
import { TRELLO_CONFIG, ERROR_MESSAGES } from '../utils/constants';

/**
 * Serviço para integração com a API do Trello
 * IMPORTANTE: Este serviço APENAS LÊ dados do Trello, nunca modifica
 */
class TrelloService {
  constructor() {
    this.apiKey = import.meta.env.VITE_TRELLO_API_KEY;
    this.token = import.meta.env.VITE_TRELLO_TOKEN;
    this.baseURL = TRELLO_CONFIG.API_BASE_URL;
    
    if (!this.apiKey || !this.token) {
      console.warn('Trello API credentials not found. Please check your environment variables.');
    }
    
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  /**
   * Cria uma instância do axios com configurações padrão
   */
  createAxiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      timeout: TRELLO_CONFIG.TIMEOUT,
      params: {
        key: this.apiKey,
        token: this.token,
      },
    });
  }

  /**
   * Implementa rate limiting para respeitar os limites do Trello
   */
  async rateLimitCheck() {
    const now = Date.now();
    
    // Reset contador se passou da janela de tempo
    if (now - this.lastRequestTime > TRELLO_CONFIG.RATE_LIMIT.WINDOW) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }
    
    // Verifica se excedeu o limite
    if (this.requestCount >= TRELLO_CONFIG.RATE_LIMIT.REQUESTS) {
      const waitTime = TRELLO_CONFIG.RATE_LIMIT.WINDOW - (now - this.lastRequestTime);
      throw new Error(ERROR_MESSAGES.TRELLO_RATE_LIMIT);
    }
    
    this.requestCount++;
  }

  /**
   * Executa uma requisição com retry automático
   */
  async makeRequest(url, params = {}, retries = TRELLO_CONFIG.RETRY_ATTEMPTS) {
    try {
      await this.rateLimitCheck();
      
      const axiosInstance = this.createAxiosInstance();
      const response = await axiosInstance.get(url, { params });
      
      return response.data;
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        console.warn(`Trello API request failed, retrying... (${retries} attempts left)`);
        await this.delay(1000); // Aguarda 1 segundo antes de tentar novamente
        return this.makeRequest(url, params, retries - 1);
      }
      
      throw this.handleError(error);
    }
  }

  /**
   * Verifica se deve tentar novamente baseado no erro
   */
  shouldRetry(error) {
    if (!error.response) return true; // Erro de rede
    
    const status = error.response.status;
    return status >= 500 || status === 429; // Erro do servidor ou rate limit
  }

  /**
   * Aguarda um tempo específico
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Trata erros da API do Trello
   */
  handleError(error) {
    if (!error.response) {
      return new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    const status = error.response.status;
    
    switch (status) {
      case 401:
        return new Error(ERROR_MESSAGES.TRELLO_AUTH);
      case 429:
        return new Error(ERROR_MESSAGES.TRELLO_RATE_LIMIT);
      case 404:
        return new Error('Quadro não encontrado. Verifique o ID do quadro.');
      case 403:
        return new Error('Acesso negado ao quadro. Verifique suas permissões.');
      default:
        return new Error(ERROR_MESSAGES.TRELLO_CONNECTION);
    }
  }

  /**
   * Busca todos os cards de um quadro
   * @param {string} boardId - ID do quadro do Trello
   * @returns {Promise<Array>} Array de cards
   */
  async getBoardCards(boardId) {
    if (!boardId) {
      throw new Error('ID do quadro é obrigatório');
    }
    
    const params = {
      fields: 'name,desc,due,labels,idMembers,dateLastActivity,url',
      members: true,
      member_fields: 'fullName,avatarUrl,username',
      labels: true,
      label_fields: 'name,color',
    };
    
    try {
      const cards = await this.makeRequest(`/boards/${boardId}/cards/all`, params);
      
      // Transforma os dados para o formato interno
      return cards.map(card => this.transformCard(card));
    } catch (error) {
      console.error('Erro ao buscar cards do quadro:', error);
      throw error;
    }
  }

  /**
   * Busca informações de um quadro específico
   * @param {string} boardId - ID do quadro do Trello
   * @returns {Promise<Object>} Informações do quadro
   */
  async getBoardInfo(boardId) {
    if (!boardId) {
      throw new Error('ID do quadro é obrigatório');
    }
    
    const params = {
      fields: 'name,desc,url,dateLastActivity',
    };
    
    try {
      const board = await this.makeRequest(`/boards/${boardId}`, params);
      return this.transformBoard(board);
    } catch (error) {
      console.error('Erro ao buscar informações do quadro:', error);
      throw error;
    }
  }

  /**
   * Busca todos os membros de um quadro
   * @param {string} boardId - ID do quadro do Trello
   * @returns {Promise<Array>} Array de membros
   */
  async getBoardMembers(boardId) {
    if (!boardId) {
      throw new Error('ID do quadro é obrigatório');
    }
    
    const params = {
      fields: 'fullName,username,avatarUrl,email',
    };
    
    try {
      const members = await this.makeRequest(`/boards/${boardId}/members`, params);
      return members.map(member => this.transformMember(member));
    } catch (error) {
      console.error('Erro ao buscar membros do quadro:', error);
      throw error;
    }
  }

  /**
   * Busca todos os labels de um quadro
   * @param {string} boardId - ID do quadro do Trello
   * @returns {Promise<Array>} Array de labels
   */
  async getBoardLabels(boardId) {
    if (!boardId) {
      throw new Error('ID do quadro é obrigatório');
    }
    
    const params = {
      fields: 'name,color',
    };
    
    try {
      const labels = await this.makeRequest(`/boards/${boardId}/labels`, params);
      return labels.map(label => this.transformLabel(label));
    } catch (error) {
      console.error('Erro ao buscar labels do quadro:', error);
      throw error;
    }
  }

  /**
   * Transforma um card do Trello para o formato interno
   */
  transformCard(trelloCard) {
    return {
      id: trelloCard.id,
      name: trelloCard.name,
      description: trelloCard.desc || '',
      due: trelloCard.due,
      url: trelloCard.url,
      labels: trelloCard.labels || [],
      members: trelloCard.members || [],
      responsible: trelloCard.members?.[0] || null, // Primeiro membro como responsável principal
      dateLastActivity: trelloCard.dateLastActivity,
      // Status local será gerenciado pelo sistema interno
      localStatus: 'não-iniciada',
    };
  }

  /**
   * Transforma informações do quadro para o formato interno
   */
  transformBoard(trelloBoard) {
    return {
      id: trelloBoard.id,
      name: trelloBoard.name,
      description: trelloBoard.desc || '',
      url: trelloBoard.url,
      dateLastActivity: trelloBoard.dateLastActivity,
    };
  }

  /**
   * Transforma um membro do Trello para o formato interno
   */
  transformMember(trelloMember) {
    return {
      id: trelloMember.id,
      name: trelloMember.fullName || trelloMember.username,
      username: trelloMember.username,
      avatarUrl: trelloMember.avatarUrl,
      email: trelloMember.email,
    };
  }

  /**
   * Transforma um label do Trello para o formato interno
   */
  transformLabel(trelloLabel) {
    return {
      id: trelloLabel.id,
      name: trelloLabel.name,
      color: trelloLabel.color,
    };
  }

  /**
   * Valida se as credenciais estão configuradas
   */
  isConfigured() {
    return !!(this.apiKey && this.token);
  }

  /**
   * Testa a conexão com o Trello
   */
  async testConnection() {
    try {
      // Faz uma requisição simples para testar a conexão
      await this.makeRequest('/members/me', { fields: 'username' });
      return true;
    } catch (error) {
      console.error('Erro ao testar conexão com Trello:', error);
      return false;
    }
  }
}

// Exporta uma instância singleton
export const trelloService = new TrelloService();
export default trelloService;


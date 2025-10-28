// Configuração da API do Trello
export const TRELLO_CONFIG = {
  API_KEY: import.meta.env.VITE_TRELLO_API_KEY,
  TOKEN: import.meta.env.VITE_TRELLO_TOKEN,
  BOARD_ID: import.meta.env.VITE_TRELLO_BOARD_ID,
  API_BASE_URL: 'https://api.trello.com/1',
};

// Verifica se as credenciais estão configuradas
export const isTrelloConfigured = () => {
  return !!(
    TRELLO_CONFIG.API_KEY &&
    TRELLO_CONFIG.TOKEN &&
    TRELLO_CONFIG.BOARD_ID
  );
};

// Retorna mensagem de erro se não estiver configurado
export const getTrelloConfigError = () => {
  if (!TRELLO_CONFIG.API_KEY) {
    return 'VITE_TRELLO_API_KEY não configurada';
  }
  if (!TRELLO_CONFIG.TOKEN) {
    return 'VITE_TRELLO_TOKEN não configurado';
  }
  if (!TRELLO_CONFIG.BOARD_ID) {
    return 'VITE_TRELLO_BOARD_ID não configurado';
  }
  return null;
};


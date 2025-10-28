// Constantes do aplicativo
export const APP_CONFIG = {
  NAME: 'Gestão de Demandas',
  VERSION: '1.0.0',
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutos
  SYNC_COOLDOWN: 30 * 1000, // 30 segundos
  DEBOUNCE_DELAY: 300, // 300ms
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos
};

// Status locais dos cards
export const CARD_STATUS = {
  NOT_STARTED: 'não-iniciada',
  IN_PROGRESS: 'em-processo',
  CHANGE: 'alteração',
  COMPLETED: 'concluída',
};

export const CARD_STATUS_LABELS = {
  [CARD_STATUS.NOT_STARTED]: 'Não iniciada',
  [CARD_STATUS.IN_PROGRESS]: 'Em processo',
  [CARD_STATUS.CHANGE]: 'Alteração',
  [CARD_STATUS.COMPLETED]: 'Concluída',
};

export const CARD_STATUS_COLORS = {
  [CARD_STATUS.NOT_STARTED]: {
    bg: 'bg-white',
    border: 'border-gray-400',
    text: 'text-gray-400',
    icon: '⚪',
  },
  [CARD_STATUS.IN_PROGRESS]: {
    bg: 'bg-blue-50',
    border: 'border-blue-500 border-2',
    text: 'text-blue-500',
    icon: '🔵',
  },
  [CARD_STATUS.CHANGE]: {
    bg: 'bg-amber-50',
    border: 'border-amber-500 border-2',
    text: 'text-amber-500',
    icon: '🟠',
  },
  [CARD_STATUS.COMPLETED]: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-500 border-2',
    text: 'text-emerald-500',
    icon: '🟢',
  },
};

// Alertas de prazo
export const DUE_DATE_ALERTS = {
  OVERDUE: 'atrasado',
  TODAY: 'hoje',
  TOMORROW: 'amanhã',
  UPCOMING: 'próximo',
  NORMAL: 'normal',
};

export const DUE_DATE_COLORS = {
  [DUE_DATE_ALERTS.OVERDUE]: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    icon: '🔴',
    label: 'ATRASADO',
  },
  [DUE_DATE_ALERTS.TODAY]: {
    bg: 'bg-amber-500',
    text: 'text-amber-500',
    icon: '🟡',
    label: 'HOJE',
  },
  [DUE_DATE_ALERTS.TOMORROW]: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    icon: '🔵',
    label: 'AMANHÃ',
  },
  [DUE_DATE_ALERTS.UPCOMING]: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    icon: '🔵',
    label: 'PRÓXIMO',
  },
  [DUE_DATE_ALERTS.NORMAL]: {
    bg: 'bg-gray-500',
    text: 'text-gray-500',
    icon: '⚪',
    label: '',
  },
};

// Filtros disponíveis
export const FILTER_TYPES = {
  STATUS: 'status',
  CATEGORY: 'category',
  DUE_DATE: 'dueDate',
  RESPONSIBLE: 'responsible',
};

export const DUE_DATE_FILTERS = {
  OVERDUE: 'atrasadas',
  TODAY: 'hoje',
  THIS_WEEK: 'esta-semana',
  THIS_MONTH: 'este-mes',
  NEXT_MONTH: 'proximo-mes',
  NO_DUE_DATE: 'sem-prazo',
};

// Configurações do Trello
export const TRELLO_CONFIG = {
  API_BASE_URL: 'https://api.trello.com/1',
  RATE_LIMIT: {
    REQUESTS: 300,
    WINDOW: 10 * 1000, // 10 segundos
  },
  TIMEOUT: 10 * 1000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

// Configurações do Firebase
export const FIREBASE_CONFIG = {
  COLLECTIONS: {
    WORKSPACES: 'workspaces',
    CARDS: 'cards',
    USERS: 'users',
  },
};

// Breakpoints responsivos
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 1024,
  DESKTOP: 1280,
};

// Grid de cards por breakpoint
export const CARD_GRID_COLUMNS = {
  MOBILE: 1,
  TABLET: 2,
  DESKTOP: 3,
  LARGE: 4,
};

// Animações
export const ANIMATIONS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_OUT: 'ease-out',
    EASE_IN: 'ease-in',
    EASE_IN_OUT: 'ease-in-out',
  },
};

// Mensagens de erro
export const ERROR_MESSAGES = {
  TRELLO_CONNECTION: 'Erro ao conectar com o Trello. Verifique sua conexão.',
  TRELLO_AUTH: 'Erro de autenticação com o Trello. Verifique suas credenciais.',
  TRELLO_RATE_LIMIT: 'Muitas requisições. Aguarde alguns segundos.',
  SYNC_FAILED: 'Falha na sincronização. Tente novamente.',
  NETWORK_ERROR: 'Erro de rede. Verifique sua conexão com a internet.',
  UNKNOWN_ERROR: 'Erro desconhecido. Tente novamente.',
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  SYNC_COMPLETED: 'Sincronização concluída com sucesso!',
  STATUS_UPDATED: 'Status atualizado com sucesso!',
  FILTERS_CLEARED: 'Filtros limpos!',
};


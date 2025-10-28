import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, isPast, isFuture, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para exibição humanizada
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  if (!date) return 'Sem prazo';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  
  return format(dateObj, 'dd \'de\' MMM \'de\' yyyy', { locale: ptBR });
};

/**
 * Retorna texto humanizado para diferença de tempo
 * @param {Date|string} date - Data de referência
 * @returns {string} Texto humanizado
 */
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: ptBR 
  });
};

/**
 * Determina o tipo de alerta baseado na data de vencimento
 * @param {Date|string} dueDate - Data de vencimento
 * @returns {string} Tipo de alerta
 */
export const getDueDateAlert = (dueDate) => {
  if (!dueDate) return 'normal';
  
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  
  if (isNaN(dateObj.getTime())) return 'normal';
  
  if (isPast(dateObj) && !isToday(dateObj)) {
    return 'atrasado';
  }
  
  if (isToday(dateObj)) {
    return 'hoje';
  }
  
  if (isTomorrow(dateObj)) {
    return 'amanhã';
  }
  
  // Próximos 3 dias
  const threeDaysFromNow = addDays(new Date(), 3);
  if (isFuture(dateObj) && dateObj <= threeDaysFromNow) {
    return 'próximo';
  }
  
  return 'normal';
};

/**
 * Retorna o texto do alerta de prazo
 * @param {Date|string} dueDate - Data de vencimento
 * @returns {string} Texto do alerta
 */
export const getDueDateAlertText = (dueDate) => {
  if (!dueDate) return '';
  
  const alert = getDueDateAlert(dueDate);
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  
  switch (alert) {
    case 'atrasado':
      const daysOverdue = Math.ceil((new Date() - dateObj) / (1000 * 60 * 60 * 24));
      return `ATRASADO ${daysOverdue}d`;
    case 'hoje':
      return 'HOJE';
    case 'amanhã':
      return 'AMANHÃ';
    case 'próximo':
      const daysUntil = Math.ceil((dateObj - new Date()) / (1000 * 60 * 60 * 24));
      return `${daysUntil} DIAS`;
    default:
      return '';
  }
};

/**
 * Retorna a cor do alerta de prazo
 * @param {Date|string} dueDate - Data de vencimento
 * @returns {string} Classe CSS da cor
 */
export const getDueDateAlertColor = (dueDate) => {
  const alert = getDueDateAlert(dueDate);
  
  switch (alert) {
    case 'atrasado':
      return 'text-red-500 bg-red-50';
    case 'hoje':
      return 'text-amber-500 bg-amber-50';
    case 'amanhã':
    case 'próximo':
      return 'text-blue-500 bg-blue-50';
    default:
      return 'text-gray-500 bg-gray-50';
  }
};

/**
 * Verifica se uma data está em um período específico
 * @param {Date|string} date - Data a verificar
 * @param {string} period - Período ('today', 'tomorrow', 'thisWeek', 'thisMonth', 'nextMonth')
 * @returns {boolean} Se a data está no período
 */
export const isDateInPeriod = (date, period) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return false;
  
  const now = new Date();
  
  switch (period) {
    case 'today':
      return isToday(dateObj);
    case 'tomorrow':
      return isTomorrow(dateObj);
    case 'thisWeek':
      return dateObj >= startOfWeek(now, { weekStartsOn: 1 }) && 
             dateObj <= endOfWeek(now, { weekStartsOn: 1 });
    case 'thisMonth':
      return dateObj >= startOfMonth(now) && 
             dateObj <= endOfMonth(now);
    case 'nextMonth':
      const nextMonth = addMonths(now, 1);
      return dateObj >= startOfMonth(nextMonth) && 
             dateObj <= endOfMonth(nextMonth);
    default:
      return false;
  }
};

/**
 * Ordena cards por data de vencimento (mais antigos primeiro)
 * @param {Array} cards - Array de cards
 * @returns {Array} Cards ordenados
 */
export const sortCardsByDueDate = (cards) => {
  return [...cards].sort((a, b) => {
    // Cards sem prazo vão para o final
    if (!a.due && !b.due) return 0;
    if (!a.due) return 1;
    if (!b.due) return -1;
    
    const dateA = new Date(a.due);
    const dateB = new Date(b.due);
    
    // Cards atrasados primeiro
    const aOverdue = isPast(dateA) && !isToday(dateA);
    const bOverdue = isPast(dateB) && !isToday(dateB);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Depois ordenar por data crescente
    return dateA - dateB;
  });
};

/**
 * Formata data para input HTML
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data no formato YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * Retorna o ícone do alerta de prazo
 * @param {Date|string} dueDate - Data de vencimento
 * @returns {string} Emoji do ícone
 */
export const getDueDateIcon = (dueDate) => {
  const alert = getDueDateAlert(dueDate);
  
  switch (alert) {
    case 'atrasado':
      return '🔴';
    case 'hoje':
      return '🟡';
    case 'amanhã':
    case 'próximo':
      return '🔵';
    default:
      return '⚪';
  }
};


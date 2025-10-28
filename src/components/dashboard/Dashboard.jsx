import React from 'react';
import { TrendingUp, AlertTriangle, Users, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../contexts/AppContext';
import { CARD_STATUS } from '../../utils/constants';
import { getOverdueCards, getTodayCards, getThisWeekCards } from '../../utils/sortCards';

/**
 * Componente de métricas do dashboard
 */
const MetricsCards = () => {
  const { cards } = useAppStore();
  
  const stats = {
    total: cards.length,
    inProgress: cards.filter(card => card.localStatus === CARD_STATUS.IN_PROGRESS).length,
    change: cards.filter(card => card.localStatus === CARD_STATUS.CHANGE).length,
    overdue: getOverdueCards(cards).length,
    today: getTodayCards(cards).length,
    thisWeek: getThisWeekCards(cards).length,
  };

  const metrics = [
    {
      title: 'Total',
      value: stats.total,
      icon: '📊',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
    {
      title: 'Em processo',
      value: stats.inProgress,
      icon: '🔵',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Alteração',
      value: stats.change,
      icon: '🟠',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Atrasadas',
      value: stats.overdue,
      icon: '🔴',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <div key={index} className={`${metric.bgColor} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </div>
            <div className="text-2xl">{metric.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Componente de gráfico de responsáveis
 */
const ResponsibleChart = () => {
  const { getCardsByResponsible } = useAppStore();
  const responsibleGroups = getCardsByResponsible();
  
  const totalCards = Object.values(responsibleGroups).reduce((total, group) => total + group.count, 0);
  
  const responsibles = Object.values(responsibleGroups)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 responsáveis

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Demandas por Responsável
      </h3>
      
      <div className="space-y-4">
        {responsibles.map((responsible, index) => {
          const percentage = totalCards > 0 ? (responsible.count / totalCards) * 100 : 0;
          
          return (
            <div key={responsible.id} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-700 truncate">
                {responsible.name}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">
                {responsible.count} ({percentage.toFixed(0)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Componente de lista de urgências
 */
const UrgentList = () => {
  const { cards } = useAppStore();
  
  const overdueCards = getOverdueCards(cards);
  const todayCards = getTodayCards(cards);
  
  const urgentCards = [
    ...overdueCards.map(card => ({ ...card, type: 'overdue' })),
    ...todayCards.map(card => ({ ...card, type: 'today' })),
  ].slice(0, 5); // Top 5 urgências

  if (urgentCards.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Atenção Necessária
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-gray-500">Nenhuma demanda urgente no momento!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
        Atenção Necessária ({urgentCards.length})
      </h3>
      
      <div className="space-y-3">
        {urgentCards.map((card) => (
          <div key={card.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 truncate">{card.name}</h4>
              <p className="text-sm text-gray-600">
                {card.responsible?.name || 'Sem responsável'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${card.type === 'overdue' 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-amber-100 text-amber-700'
                }
              `}>
                {card.type === 'overdue' ? 'Atrasado' : 'Hoje'}
              </span>
              <button
                onClick={() => window.open(card.url, '_blank')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Ver →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente principal do dashboard
 */
const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Resumo de Demandas
        </h2>
        <p className="text-gray-600">
          Visão geral das demandas e métricas importantes
        </p>
      </div>

      {/* Métricas principais */}
      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de responsáveis */}
        <ResponsibleChart />

        {/* Lista de urgências */}
        <UrgentList />
      </div>
    </div>
  );
};

export default Dashboard;


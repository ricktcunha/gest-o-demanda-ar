import React from 'react';
import { RefreshCw, Settings, User, Clock } from 'lucide-react';
import { useAppStore } from '../../contexts/AppContext';
import { getTimeAgo } from '../../utils/dateFormatter';
import { toast } from 'react-hot-toast';

/**
 * Componente Header fixo com informações principais e controles
 */
const Header = () => {
  const {
    isSyncing,
    lastSync,
    syncWithTrello,
    currentWorkspace,
    error,
    clearError,
  } = useAppStore();

  const handleSync = async () => {
    if (!currentWorkspace?.trelloBoardId) {
      toast.error('Workspace não configurado');
      return;
    }

    try {
      await syncWithTrello(currentWorkspace.trelloBoardId, true);
      toast.success('Sincronização concluída!');
    } catch (error) {
      toast.error(error.message || 'Erro na sincronização');
    }
  };

  const handleSettings = () => {
    // TODO: Implementar modal de configurações
    toast.info('Configurações em breve...');
  };

  const handleUser = () => {
    // TODO: Implementar menu do usuário
    toast.info('Menu do usuário em breve...');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📋</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Gestão de Demandas
              </h1>
            </div>
          </div>

          {/* Informações de sincronização */}
          <div className="flex items-center space-x-4">
            {lastSync && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>
                  Última sincronização: {getTimeAgo(lastSync)}
                </span>
              </div>
            )}

            {/* Botão de sincronização */}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
                ${isSyncing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                }
              `}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </span>
            </button>

            {/* Botão de configurações */}
            <button
              onClick={handleSettings}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition-all duration-200"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Botão do usuário */}
            <button
              onClick={handleUser}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
              title="Usuário"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de erro */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600 transition-colors duration-200"
              >
                <span className="sr-only">Fechar</span>
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;


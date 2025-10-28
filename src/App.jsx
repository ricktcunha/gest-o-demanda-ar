import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppStore } from './contexts/AppContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';
import FilterBar from './components/filters/FilterBar';
import Dashboard from './components/dashboard/Dashboard';
import CardsView from './pages/CardsView';

/**
 * Componente principal da aplicação
 */
const App = () => {
  const {
    currentWorkspace,
    syncWithTrello,
    startAutoSync,
    stopAutoSync,
    isLoading,
    setLoading,
  } = useAppStore();

  // Inicializa a aplicação
  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      
      try {
        // Verifica se há um workspace configurado
        if (currentWorkspace?.trelloBoardId) {
          // Sincroniza dados iniciais
          await syncWithTrello(currentWorkspace.trelloBoardId);
          
          // Inicia sincronização automática
          startAutoSync(currentWorkspace.trelloBoardId);
        } else {
          console.warn('Nenhum workspace configurado');
        }
      } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Cleanup ao desmontar
    return () => {
      stopAutoSync();
    };
  }, [currentWorkspace?.trelloBoardId]);

  // Configuração de workspace de exemplo (para desenvolvimento)
  useEffect(() => {
    if (!currentWorkspace) {
      // TODO: Implementar configuração de workspace
      // Por enquanto, usa valores de exemplo
      const exampleWorkspace = {
        id: 'example-workspace',
        name: 'Workspace de Exemplo',
        trelloBoardId: 'example-board-id',
        createdAt: new Date().toISOString(),
      };
      
      useAppStore.getState().setCurrentWorkspace(exampleWorkspace);
    }
  }, [currentWorkspace]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-white text-2xl">📋</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando Gestão de Demandas
          </h2>
          <p className="text-gray-600">
            Sincronizando dados do Trello...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Header fixo */}
          <Header />
          
          {/* Navegação por abas */}
          <TabNavigation />
          
          {/* Barra de filtros */}
          <FilterBar />
          
          {/* Conteúdo principal */}
          <main className="pb-8">
            <Routes>
              <Route path="/" element={<CardsView />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cards" element={<CardsView />} />
            </Routes>
          </main>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

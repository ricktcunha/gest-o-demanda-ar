import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CardsView from './pages/CardsView.tsx';

/**
 * Componente principal da aplicação - Versão simplificada
 */
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header simples */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                📋 Gestão de Demandas
              </h1>
              <div className="text-sm text-gray-500">
                Sistema integrado com Trello
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="pb-8">
          <Routes>
            <Route path="/" element={<CardsView />} />
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
  );
};

export default App;
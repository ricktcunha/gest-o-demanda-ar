import React from 'react';

/**
 * Página principal de visualização de cards - Versão simplificada para teste
 */
const CardsView = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Gestão de Demandas
        </h2>
        <p className="text-gray-600">
          Sistema de gestão de demandas integrado com Trello
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎉 Aplicação funcionando!
        </h3>
        <p className="text-gray-600 mb-4">
          A aplicação está rodando corretamente. Próximos passos:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Configure as credenciais do Trello no arquivo .env.local</li>
          <li>Teste a sincronização com o Trello</li>
          <li>Explore as funcionalidades do sistema</li>
        </ul>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Para configurar o Trello:</h4>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Acesse: https://trello.com/app-key</li>
            <li>Copie sua API Key e Token</li>
            <li>Crie arquivo .env.local na raiz do projeto</li>
            <li>Adicione suas credenciais</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CardsView;
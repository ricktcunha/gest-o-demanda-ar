import { useState } from 'react';
import { trelloService } from '../services/trelloService';

/**
 * Componente para testar a conexão com o Trello
 */
const TrelloTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await trelloService.syncAll();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isConfigured = trelloService.isConfigured();

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔗 Teste de Conexão com Trello
      </h3>

      {!isConfigured ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Credenciais não configuradas</h4>
          <p className="text-yellow-700 mb-2">
            Para usar o Trello, você precisa configurar as credenciais:
          </p>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Crie arquivo <code className="bg-yellow-100 px-1 rounded">.env.local</code> na raiz do projeto</li>
            <li>Adicione suas credenciais do Trello</li>
            <li>Reinicie o servidor de desenvolvimento</li>
          </ol>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-800 mb-2">✅ Credenciais configuradas</h4>
          <p className="text-green-700">
            As credenciais do Trello estão configuradas. Clique no botão abaixo para testar a conexão.
          </p>
        </div>
      )}

      <button
        onClick={testConnection}
        disabled={!isConfigured || isLoading}
        className={`px-4 py-2 rounded-lg font-medium ${
          !isConfigured || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {isLoading ? '🔄 Testando...' : '🧪 Testar Conexão'}
      </button>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800 mb-2">❌ Erro na conexão</h4>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">✅ Conexão bem-sucedida!</h4>
          <div className="text-green-700 space-y-2">
            <p><strong>Quadro:</strong> {result.board.name}</p>
            <p><strong>Cards:</strong> {result.cards.length}</p>
            <p><strong>Membros:</strong> {result.members.length}</p>
            <p><strong>Labels:</strong> {result.labels.length}</p>
            <p><strong>Última sincronização:</strong> {new Date(result.lastSync).toLocaleString()}</p>
          </div>
          
          {result.cards.length > 0 && (
            <div className="mt-4">
              <h5 className="font-semibold text-green-800 mb-2">📋 Primeiros cards:</h5>
              <div className="space-y-2">
                {result.cards.slice(0, 3).map((card) => (
                  <div key={card.id} className="bg-white p-3 rounded border">
                    <h6 className="font-medium">{card.name}</h6>
                    <p className="text-sm text-gray-600">
                      {card.due ? `Prazo: ${new Date(card.due).toLocaleDateString()}` : 'Sem prazo'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrelloTest;

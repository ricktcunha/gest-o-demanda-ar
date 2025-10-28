# INSTRUÇÕES PARA CONFIGURAR AS CREDENCIAIS

## 1. TRELLO API - OBRIGATÓRIO

1. Acesse: https://trello.com/app-key
2. Copie sua API Key
3. Clique em "Token" para gerar um token de acesso
4. Copie o Token gerado
5. Abra seu quadro do Trello no navegador
6. Copie o ID do quadro da URL (parte após /b/)

## 2. CRIAR ARQUIVO .env.local

Crie um arquivo chamado ".env.local" na raiz do projeto com:

```
VITE_TRELLO_API_KEY=sua_api_key_aqui
VITE_TRELLO_TOKEN=seu_token_aqui
VITE_TRELLO_BOARD_ID=id_do_seu_quadro_aqui
```

## 3. FIREBASE (OPCIONAL)

Se quiser usar Firebase para armazenamento:

1. Acesse: https://console.firebase.google.com
2. Crie um novo projeto
3. Ative o Firestore Database
4. Copie as credenciais do projeto
5. Adicione ao arquivo .env.local:

```
VITE_FIREBASE_API_KEY=sua_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

## 4. EXECUTAR O PROJETO

Após configurar as credenciais:

```bash
npm run dev
```

O aplicativo estará disponível em: http://localhost:3000

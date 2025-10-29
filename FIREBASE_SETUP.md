# CONFIGURAÇÃO DO FIREBASE - INSTRUÇÕES

## 1. OBTER AS CREDENCIAIS DO FIREBASE

1. Acesse: https://console.firebase.google.com/project/gestao-ar-8ec6c
2. Clique em "Configurações do projeto" (ícone de engrenagem)
3. Vá para a aba "Geral"
4. Role para baixo até "Seus aplicativos"
5. Clique em "Adicionar aplicativo" > "Web" (ícone </>)
6. Registre o app com nome: "Gestão de Demandas"
7. Copie as credenciais que aparecem

## 2. ATIVAR O FIRESTORE

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha uma localização (recomendo: us-central1)

## 3. CRIAR ARQUIVO .env.local

Crie um arquivo `.env.local` na raiz do projeto com:

```
# Firebase Config
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=gestao-ar-8ec6c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gestao-ar-8ec6c
VITE_FIREBASE_STORAGE_BUCKET=gestao-ar-8ec6c.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=301702930393
VITE_FIREBASE_APP_ID=seu_app_id_aqui

# Trello API
VITE_TRELLO_API_KEY=sua_api_key_aqui
VITE_TRELLO_TOKEN=seu_token_aqui
VITE_TRELLO_BOARD_ID=id_do_seu_quadro_aqui
```

## 4. ATUALIZAR O ARQUIVO firebase.js

Substitua as credenciais no arquivo `src/lib/firebase.js` pelas suas credenciais reais.

## 5. TESTAR A CONEXÃO

Após configurar, execute:
```bash
npm run dev
```

A aplicação deve conectar com o Firebase sem erros.

## 6. DEPLOY (OPCIONAL)

Para fazer deploy:
```bash
npm run build
firebase deploy
```

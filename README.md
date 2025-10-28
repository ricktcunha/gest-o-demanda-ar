# 📋 Gestão de Demandas

Sistema web profissional para gestão de demandas integrado com Trello, desenvolvido com React e Tailwind CSS.

## 🎯 Características Principais

- **Integração com Trello**: Sincronização automática de cards (somente leitura)
- **Organização por Responsável**: Abas para cada membro do quadro
- **Status Local**: Controle de status independente do Trello
- **Ordenação Inteligente**: Cards ordenados por prazo (antigos primeiro)
- **Filtros Avançados**: Busca e filtros por status, categoria, prazo e responsável
- **Dashboard**: Visão geral com métricas e gráficos
- **Responsivo**: Funciona perfeitamente em mobile, tablet e desktop

## 🚀 Tecnologias Utilizadas

- **React 18.3+** - Framework principal
- **Tailwind CSS 3.4.17** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Router** - Navegação
- **Axios** - Requisições HTTP
- **Firebase Firestore** - Armazenamento (opcional)
- **Framer Motion** - Animações
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

## 📦 Instalação

1. **Clone o repositório**

   ```bash
   git clone <repository-url>
   cd gestao-demandas
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto:

   ```env
   # Configuração do Trello API
   VITE_TRELLO_API_KEY=your_trello_api_key_here
   VITE_TRELLO_TOKEN=your_trello_token_here

   # Configuração do Firebase (opcional)
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # ID do quadro do Trello
   VITE_TRELLO_BOARD_ID=your_board_id_here
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

## 🔧 Configuração do Trello

### 1. Obter Credenciais da API

1. Acesse [https://trello.com/app-key](https://trello.com/app-key)
2. Copie sua **API Key**
3. Clique em "Token" para gerar um token de acesso
4. Copie o **Token**

### 2. Obter ID do Quadro

1. Abra o quadro do Trello no navegador
2. Copie a URL do quadro
3. O ID é a parte após `/b/` na URL

   Exemplo: `https://trello.com/b/ABC123DEF/meu-quadro`
   ID: `ABC123DEF`

### 3. Configurar Permissões

Certifique-se de que o token tem acesso de leitura ao quadro desejado.

## 🔥 Configuração do Firebase (Opcional)

Se não configurar o Firebase, o aplicativo usará localStorage como fallback.

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o Firestore Database
3. Configure as regras de segurança:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
4. Copie as credenciais do projeto para o arquivo `.env.local`

## 📱 Funcionalidades

### 🔄 Sincronização

- **Automática**: A cada 5 minutos
- **Manual**: Botão "Sincronizar" no header
- **Indicadores**: Status da última sincronização

### 📊 Dashboard

- Métricas gerais (total, em processo, alteração, atrasadas)
- Gráfico de distribuição por responsável
- Lista de demandas urgentes

### 🏷️ Status Locais

- **Não iniciada**: Cinza
- **Em processo**: Azul
- **Alteração**: Laranja
- **Concluída**: Verde

### 🔍 Filtros

- Busca em tempo real
- Filtro por status
- Filtro por categoria/label
- Filtro por prazo (atrasadas, hoje, esta semana, etc.)
- Filtro por responsável

### 📱 Responsividade

- **Mobile**: 1 coluna de cards
- **Tablet**: 2 colunas de cards
- **Desktop**: 3-4 colunas de cards

## 🎨 Design System

### Cores

- **Status não iniciada**: `#9CA3AF` (gray-400)
- **Status em processo**: `#3B82F6` (blue-500)
- **Status alteração**: `#F59E0B` (amber-500)
- **Status concluída**: `#10B981` (emerald-500)
- **Atrasado**: `#EF4444` (red-500)

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Título do card**: `text-lg font-semibold`
- **Descrição**: `text-sm text-gray-600`
- **Labels**: `text-xs font-medium uppercase`

## 🚀 Deploy

### Firebase Hosting

```bash
npm run build
firebase deploy
```

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
# Faça upload da pasta dist/
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/          # Header, navegação
│   ├── cards/           # Componentes de cards
│   ├── dashboard/       # Componentes do dashboard
│   ├── filters/         # Filtros e busca
│   └── common/          # Componentes reutilizáveis
├── services/            # Serviços (Trello, Firebase, Storage)
├── hooks/               # Hooks customizados
├── contexts/            # Contextos React
├── utils/               # Utilitários e helpers
├── lib/                 # Configurações de bibliotecas
└── pages/               # Páginas da aplicação
```

## 🔒 Segurança

- **Nunca** exponha credenciais no frontend
- Use Firebase Functions como proxy para a API do Trello
- Valide todos os inputs do usuário
- Configure CORS corretamente
- Use HTTPS em produção

## 🐛 Solução de Problemas

### Erro de Conexão com Trello

- Verifique se as credenciais estão corretas
- Confirme se o token tem acesso ao quadro
- Verifique a conexão com a internet

### Erro de Firebase

- Confirme se o projeto está configurado
- Verifique as regras de segurança do Firestore
- O app funcionará com localStorage se o Firebase falhar

### Performance Lenta

- Verifique se há muitos cards no quadro
- Considere implementar paginação
- Use o cache local para melhorar performance

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email.

---

Desenvolvido com ❤️ para facilitar a gestão de demandas!


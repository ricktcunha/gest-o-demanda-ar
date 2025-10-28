import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../utils/constants';

/**
 * Configuração do Firebase
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Serviço para gerenciar dados no Firestore
 */
class FirestoreService {
  constructor() {
    this.db = db;
  }

  /**
   * Salva o status local de um card
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @param {string} status - Status local
   * @param {string} userId - ID do usuário que fez a alteração
   * @param {string} notes - Notas adicionais (opcional)
   */
  async saveCardStatus(workspaceId, cardId, status, userId, notes = '') {
    try {
      const cardRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId, 'cards', cardId);
      
      await setDoc(cardRef, {
        status,
        lastUpdated: serverTimestamp(),
        updatedBy: userId,
        notes,
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar status do card:', error);
      throw error;
    }
  }

  /**
   * Busca o status local de um card
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @returns {Promise<Object|null>} Status do card ou null se não encontrado
   */
  async getCardStatus(workspaceId, cardId) {
    try {
      const cardRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId, 'cards', cardId);
      const cardSnap = await getDoc(cardRef);
      
      if (cardSnap.exists()) {
        return cardSnap.data();
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar status do card:', error);
      throw error;
    }
  }

  /**
   * Busca todos os status de cards de um workspace
   * @param {string} workspaceId - ID do workspace
   * @returns {Promise<Object>} Objeto com status de todos os cards
   */
  async getAllCardStatuses(workspaceId) {
    try {
      const cardsRef = collection(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId, 'cards');
      const cardsSnap = await getDocs(cardsRef);
      
      const statuses = {};
      cardsSnap.forEach(doc => {
        statuses[doc.id] = doc.data();
      });
      
      return statuses;
    } catch (error) {
      console.error('Erro ao buscar status dos cards:', error);
      throw error;
    }
  }

  /**
   * Salva informações do workspace
   * @param {string} workspaceId - ID do workspace
   * @param {Object} workspaceData - Dados do workspace
   */
  async saveWorkspace(workspaceId, workspaceData) {
    try {
      const workspaceRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId);
      
      await setDoc(workspaceRef, {
        ...workspaceData,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar workspace:', error);
      throw error;
    }
  }

  /**
   * Busca informações do workspace
   * @param {string} workspaceId - ID do workspace
   * @returns {Promise<Object|null>} Dados do workspace ou null se não encontrado
   */
  async getWorkspace(workspaceId) {
    try {
      const workspaceRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId);
      const workspaceSnap = await getDoc(workspaceRef);
      
      if (workspaceSnap.exists()) {
        return workspaceSnap.data();
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar workspace:', error);
      throw error;
    }
  }

  /**
   * Salva informações do usuário
   * @param {string} userId - ID do usuário
   * @param {Object} userData - Dados do usuário
   */
  async saveUser(userId, userData) {
    try {
      const userRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.USERS, userId);
      
      await setDoc(userRef, {
        ...userData,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  }

  /**
   * Busca informações do usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object|null>} Dados do usuário ou null se não encontrado
   */
  async getUser(userId) {
    try {
      const userRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  /**
   * Salva histórico de mudanças de status
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @param {string} oldStatus - Status anterior
   * @param {string} newStatus - Novo status
   * @param {string} userId - ID do usuário que fez a alteração
   */
  async saveStatusHistory(workspaceId, cardId, oldStatus, newStatus, userId) {
    try {
      const historyRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId, 'cards', cardId, 'history', Date.now().toString());
      
      await setDoc(historyRef, {
        oldStatus,
        newStatus,
        changedBy: userId,
        changedAt: serverTimestamp(),
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
      throw error;
    }
  }

  /**
   * Busca histórico de mudanças de um card
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   * @returns {Promise<Array>} Array com histórico de mudanças
   */
  async getCardHistory(workspaceId, cardId) {
    try {
      const historyRef = collection(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId, 'cards', cardId, 'history');
      const historyQuery = query(historyRef, orderBy('changedAt', 'desc'));
      const historySnap = await getDocs(historyQuery);
      
      const history = [];
      historySnap.forEach(doc => {
        history.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return history;
    } catch (error) {
      console.error('Erro ao buscar histórico do card:', error);
      throw error;
    }
  }

  /**
   * Remove dados de um card (quando removido do Trello)
   * @param {string} workspaceId - ID do workspace
   * @param {string} cardId - ID do card do Trello
   */
  async removeCard(workspaceId, cardId) {
    try {
      const cardRef = doc(this.db, FIREBASE_CONFIG.COLLECTIONS.WORKSPACES, workspaceId, 'cards', cardId);
      await deleteDoc(cardRef);
      
      return true;
    } catch (error) {
      console.error('Erro ao remover card:', error);
      throw error;
    }
  }

  /**
   * Verifica se o Firestore está configurado
   */
  isConfigured() {
    return !!(
      import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    );
  }
}

// Exporta uma instância singleton
export const firestoreService = new FirestoreService();
export default firestoreService;


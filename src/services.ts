import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { Card, Category } from './types';

// Categories Collection
const categoriesCollection = collection(db, 'categories');
const cardsCollection = collection(db, 'cards');

export const categoryService = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    const snapshot = await getDocs(categoriesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Category));
  },

  // Add a new category
  async add(name: string): Promise<string> {
    const docRef = await addDoc(categoriesCollection, { name });
    return docRef.id;
  },

  // Get or create a category by name
  async getOrCreate(name: string): Promise<string> {
    const categories = await this.getAll();
    const existing = categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return existing.id;
    }
    return await this.add(name);
  }
};

export const cardService = {
  // Get all cards
  async getAll(): Promise<Card[]> {
    const q = query(cardsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date()
      } as Card;
    });
  },

  // Add a new card
  async add(card: Omit<Card, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(cardsCollection, {
      ...card,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Update a card
  async update(id: string, card: Partial<Omit<Card, 'id' | 'createdAt'>>): Promise<void> {
    const cardDoc = doc(db, 'cards', id);
    await updateDoc(cardDoc, card);
  },

  // Delete a card
  async delete(id: string): Promise<void> {
    const cardDoc = doc(db, 'cards', id);
    await deleteDoc(cardDoc);
  }
};

import type { Card, Category } from './types';

// Mock data storage using localStorage for demo purposes
const CARDS_KEY = 'demo_cards';
const CATEGORIES_KEY = 'demo_categories';

// Initialize with some sample data if empty
const initializeDemoData = () => {
  if (!localStorage.getItem(CARDS_KEY)) {
    const sampleCards: Card[] = [
      {
        id: '1',
        finnishWord: 'Terve',
        englishWord: 'Hello',
        categoryId: 'cat1',
        categoryName: 'Greetings',
        createdAt: new Date()
      },
      {
        id: '2',
        finnishWord: 'Kiitos',
        englishWord: 'Thank you',
        categoryId: 'cat1',
        categoryName: 'Greetings',
        createdAt: new Date()
      },
      {
        id: '3',
        finnishWord: 'Kissa',
        englishWord: 'Cat',
        categoryId: 'cat2',
        categoryName: 'Animals',
        createdAt: new Date()
      }
    ];
    localStorage.setItem(CARDS_KEY, JSON.stringify(sampleCards));
  }

  if (!localStorage.getItem(CATEGORIES_KEY)) {
    const sampleCategories: Category[] = [
      { id: 'cat1', name: 'Greetings' },
      { id: 'cat2', name: 'Animals' }
    ];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(sampleCategories));
  }
};

// Initialize on load
initializeDemoData();

export const demoCardService = {
  async getAll(): Promise<Card[]> {
    const data = localStorage.getItem(CARDS_KEY);
    if (!data) return [];
    const cards: Card[] = JSON.parse(data);
    return cards.map((card) => ({
      ...card,
      createdAt: new Date(card.createdAt)
    })).sort((a: Card, b: Card) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async add(card: Omit<Card, 'id' | 'createdAt'>): Promise<string> {
    const cards = await this.getAll();
    const newCard: Card = {
      ...card,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    cards.unshift(newCard);
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    return newCard.id;
  },

  async update(id: string, cardUpdate: Partial<Omit<Card, 'id' | 'createdAt'>>): Promise<void> {
    const cards = await this.getAll();
    const index = cards.findIndex(c => c.id === id);
    if (index >= 0) {
      cards[index] = { ...cards[index], ...cardUpdate };
      localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    }
  },

  async delete(id: string): Promise<void> {
    const cards = await this.getAll();
    const filtered = cards.filter(c => c.id !== id);
    localStorage.setItem(CARDS_KEY, JSON.stringify(filtered));
  }
};

export const demoCategoryService = {
  async getAll(): Promise<Category[]> {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  async add(name: string): Promise<string> {
    const categories = await this.getAll();
    const newCategory: Category = {
      id: Date.now().toString(),
      name
    };
    categories.push(newCategory);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory.id;
  },

  async getOrCreate(name: string): Promise<string> {
    const categories = await this.getAll();
    const existing = categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return existing.id;
    }
    return await this.add(name);
  }
};

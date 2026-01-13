export interface Category {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  finnishWord: string;
  englishWord: string;
  categoryId: string;
  categoryName?: string; // Denormalized for easier display
  createdAt: Date;
}

import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Card, Category } from './types';

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, finnishWord: string, englishWord: string, categoryName: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  card: Card | null;
  categories: Category[];
}

export default function EditCardModal({ isOpen, onClose, onUpdate, onDelete, card, categories }: EditCardModalProps) {
  const [finnishWord, setFinnishWord] = useState('');
  const [englishWord, setEnglishWord] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (card) {
      setFinnishWord(card.finnishWord);
      setEnglishWord(card.englishWord);
      setCategoryName(card.categoryName || '');
    }
  }, [card]);

  useEffect(() => {
    if (categoryName) {
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(categoryName.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [categoryName, categories]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!card || !finnishWord.trim() || !englishWord.trim() || !categoryName.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(card.id, finnishWord.trim(), englishWord.trim(), categoryName.trim());
      onClose();
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Failed to update card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!card) return;
    
    if (window.confirm('Are you sure you want to delete this card?')) {
      setIsSubmitting(true);
      try {
        await onDelete(card.id);
        onClose();
      } catch (error) {
        console.error('Error deleting card:', error);
        alert('Failed to delete card. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCategorySelect = (name: string) => {
    setCategoryName(name);
    setShowSuggestions(false);
  };

  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-card-heading"
      >
        <h2 id="edit-card-heading" className="text-2xl font-bold mb-4 text-gray-800">Edit Card</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-finnishWord" className="block text-sm font-medium text-gray-700 mb-2">
              Finnish Word
            </label>
            <input
              type="text"
              id="edit-finnishWord"
              value={finnishWord}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFinnishWord(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter Finnish word"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="edit-englishWord" className="block text-sm font-medium text-gray-700 mb-2">
              English Word
            </label>
            <input
              type="text"
              id="edit-englishWord"
              value={englishWord}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEnglishWord(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter English word"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              id="edit-category"
              value={categoryName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCategoryName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter or select category"
              required
            />
            {showSuggestions && filteredCategories.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
                {filteredCategories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.name)}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-gray-900"
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Delete
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

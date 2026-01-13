import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Category } from './types';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (finnishWord: string, englishWord: string, categoryName: string) => Promise<void>;
  categories: Category[];
}

export default function AddCardModal({ isOpen, onClose, onSubmit, categories }: AddCardModalProps) {
  const [finnishWord, setFinnishWord] = useState('');
  const [englishWord, setEnglishWord] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!finnishWord.trim() || !englishWord.trim() || !categoryName.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(finnishWord.trim(), englishWord.trim(), categoryName.trim());
      setFinnishWord('');
      setEnglishWord('');
      setCategoryName('');
      onClose();
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to add card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (name: string) => {
    setCategoryName(name);
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Card</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="finnishWord" className="block text-sm font-medium text-gray-700 mb-2">
              Finnish Word
            </label>
            <input
              type="text"
              id="finnishWord"
              value={finnishWord}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFinnishWord(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter Finnish word"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="englishWord" className="block text-sm font-medium text-gray-700 mb-2">
              English Word
            </label>
            <input
              type="text"
              id="englishWord"
              value={englishWord}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEnglishWord(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter English word"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
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

          <div className="flex justify-end gap-3">
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
              {isSubmitting ? 'Adding...' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

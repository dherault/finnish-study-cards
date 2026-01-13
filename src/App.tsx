import { useState, useEffect, useCallback } from 'react';
import FlashCard from './FlashCard';
import AddCardModal from './AddCardModal';
import EditCardModal from './EditCardModal';
import type { Card, Category } from './types';
import { cardService, categoryService } from './services';
// Removed demo mode; using real services only

// Demo mode removed; app now uses real Firebase services

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Select service based on mode
  const cardSvc = cardService;
  const categorySvc = categoryService;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [cardsData, categoriesData] = await Promise.all([
        cardSvc.getAll(),
        categorySvc.getAll()
      ]);
      setCards(cardsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  }, [cardSvc, categorySvc]);

  // Load cards and categories on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCard = async (finnishWord: string, englishWord: string, categoryName: string) => {
    const categoryId = await categorySvc.getOrCreate(categoryName);
    await cardSvc.add({
      finnishWord,
      englishWord,
      categoryId,
      categoryName
    });
    await loadData();
  };

  const handleUpdateCard = async (id: string, finnishWord: string, englishWord: string, categoryName: string) => {
    const categoryId = await categorySvc.getOrCreate(categoryName);
    await cardSvc.update(id, {
      finnishWord,
      englishWord,
      categoryId,
      categoryName
    });
    await loadData();
  };

  const handleDeleteCard = async (id: string) => {
    await cardSvc.delete(id);
    // Adjust current index before reloading data
    if (currentCardIndex >= cards.length - 1 && cards.length > 1) {
      setCurrentCardIndex(cards.length - 2);
    }
    await loadData();
  };

  const goToNextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const currentCard = cards[currentCardIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center mb-2 text-gray-800">
          Finnish Study Cards
        </h1>
        {/* Demo mode notice removed */}

        {cards.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">No cards yet!</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Add Your First Card
            </button>
          </div>
        ) : (
          <>
            <FlashCard card={currentCard} />

            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={goToPreviousCard}
                className="w-32 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={cards.length <= 1}
              >
                ← Previous
              </button>
              <span className="text-gray-700 font-medium">
                {currentCardIndex + 1} / {cards.length}
              </span>
              <button
                onClick={goToNextCard}
                className="w-32 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={cards.length <= 1}
              >
                Next →
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-37.5 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-center"
              >
                 Add Card
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-37.5 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-center"
              >
                Edit Card
              </button>
            </div>
          </>
        )}

        <AddCardModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCard}
          categories={categories}
        />

        <EditCardModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
          card={currentCard}
          categories={categories}
        />
      </div>
    </div>
  );
}

export default App;

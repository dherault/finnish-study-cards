import { useState, useEffect } from 'react';
import FlashCard from './FlashCard';
import AddCardModal from './AddCardModal';
import EditCardModal from './EditCardModal';
import type { Card, Category } from './types';
import { cardService, categoryService } from './services';
import { demoCardService, demoCategoryService } from './demo-services';

// Use demo mode by default to showcase the app without Firebase connection issues
const USE_DEMO_MODE = true;

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Select service based on mode
  const cardSvc = USE_DEMO_MODE ? demoCardService : cardService;
  const categorySvc = USE_DEMO_MODE ? demoCategoryService : categoryService;

  // Load cards and categories on mount
  useEffect(() => {
    const loadData = async () => {
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
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
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
  };

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
    await loadData();
    if (currentCardIndex >= cards.length - 1) {
      setCurrentCardIndex(Math.max(0, cards.length - 2));
    }
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
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Finnish Study Cards
        </h1>
        {USE_DEMO_MODE && (
          <p className="text-center text-sm text-gray-600 mb-6">
            Demo Mode - Data stored in browser localStorage
          </p>
        )}

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
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={cards.length <= 1}
              >
                ← Previous
              </button>
              <span className="text-gray-700 font-medium">
                {currentCardIndex + 1} / {cards.length}
              </span>
              <button
                onClick={goToNextCard}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={cards.length <= 1}
              >
                Next →
              </button>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                + Add Card
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
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

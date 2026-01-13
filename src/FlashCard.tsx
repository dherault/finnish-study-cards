import { useState } from 'react';
import type { Card } from './types';

interface FlashCardProps {
  card: Card;
}

export default function FlashCard({ card }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto perspective">
      <div
        className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front side - Finnish */}
        <div
          className="absolute w-full h-full bg-blue-500 text-white rounded-lg shadow-xl flex items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">{card.finnishWord}</h2>
            <p className="text-sm opacity-75">Click to flip</p>
            {card.categoryName && (
              <span className="inline-block mt-4 px-3 py-1 bg-blue-600 rounded-full text-xs">
                {card.categoryName}
              </span>
            )}
          </div>
        </div>

        {/* Back side - English */}
        <div
          className="absolute w-full h-full bg-green-500 text-white rounded-lg shadow-xl flex items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">{card.englishWord}</h2>
            <p className="text-sm opacity-75">Click to flip back</p>
            {card.categoryName && (
              <span className="inline-block mt-4 px-3 py-1 bg-green-600 rounded-full text-xs">
                {card.categoryName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

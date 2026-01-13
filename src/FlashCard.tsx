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
          className="absolute w-full h-full bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 flex items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="absolute top-3 left-3 text-lg">🇫🇮</div>
          <div className="text-center">
            <h2 className="text-4xl font-bold">{card.finnishWord}</h2>
          </div>
        </div>

        {/* Back side - English */}
        <div
          className="absolute w-full h-full bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 flex items-center justify-center p-8"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="absolute top-3 left-3 text-lg">🇺🇸</div>
          <div className="text-center">
            <h2 className="text-4xl font-bold">{card.englishWord}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

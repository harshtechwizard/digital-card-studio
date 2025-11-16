import { useState, useEffect } from 'react';
import { BusinessCard } from '@/types/businessCard';

const STORAGE_KEY = 'business-cards';

export function useBusinessCards() {
  const [cards, setCards] = useState<BusinessCard[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCards(JSON.parse(stored));
    }
  }, []);

  const saveCards = (newCards: BusinessCard[]) => {
    setCards(newCards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
  };

  const addCard = (card: Omit<BusinessCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard: BusinessCard = {
      ...card,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCards([...cards, newCard]);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<BusinessCard>) => {
    const newCards = cards.map(card =>
      card.id === id
        ? { ...card, ...updates, updatedAt: new Date().toISOString() }
        : card
    );
    saveCards(newCards);
  };

  const deleteCard = (id: string) => {
    saveCards(cards.filter(card => card.id !== id));
  };

  return { cards, addCard, updateCard, deleteCard };
}

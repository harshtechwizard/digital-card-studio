import { useState, useEffect } from 'react';
import { Card } from '@/types/card';

const STORAGE_KEY = 'user-cards';

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCards(JSON.parse(stored));
    }
  }, []);

  const saveCards = (newCards: Card[]) => {
    setCards(newCards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
  };

  const addCard = (card: Omit<Card, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCard: Card = {
      ...card,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveCards([...cards, newCard]);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<Card>) => {
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

  const setDefaultCard = (id: string) => {
    const newCards = cards.map(card => ({
      ...card,
      isDefault: card.id === id,
    }));
    saveCards(newCards);
  };

  const getCardBySlug = (slug: string) => {
    return cards.find(card => card.slug === slug);
  };

  return { cards, addCard, updateCard, deleteCard, setDefaultCard, getCardBySlug };
}

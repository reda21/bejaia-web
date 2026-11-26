'use client';

import { useApp } from '@/components/providers/AppProviders';

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite, favoritesOpen, setFavoritesOpen } = useApp();
  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoritesOpen,
    setFavoritesOpen,
  };
}

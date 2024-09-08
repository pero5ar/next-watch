'use client';

import { useContext, useMemo } from 'react';
import { FavoritesStateContext } from '@/contexts/favorites/favorites.context';
import MovieListSection from '@/components/MovieListSection/MovieListSection';

function FavoritesSection() {
  const favoritesState = useContext(FavoritesStateContext);

  const movies = useMemo(() => favoritesState.list
    .map((id) => favoritesState.lookup[id])
    .filter((item) => !!item),
  [favoritesState]);

  return <MovieListSection movies={movies} />;
}

export default FavoritesSection;

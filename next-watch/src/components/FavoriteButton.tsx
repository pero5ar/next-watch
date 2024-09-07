'use client';

import { MouseEvent, useCallback, useContext } from 'react';

import type { MovieSuggestion } from '@/models/movieSuggestion.model';
import { FavoritesStateContext, FavoritesDispatchContext } from '@/contexts/favorites/favorites.context';

interface Props {
  movie: MovieSuggestion;
}

function FavoriteButton({ movie }: Props) {
  const favoritesState = useContext(FavoritesStateContext);
  const favoritesDispatch = useContext(FavoritesDispatchContext);

  const isInFavorites = !!favoritesState.lookup[movie.imdbId];

  const handleOnClick = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isInFavorites) {
      favoritesDispatch({ type: 'REMOVE', payload: { imdbId: movie.imdbId } });
    } else {
      favoritesDispatch({ type: 'ADD', payload: movie });
    }
  }, [favoritesDispatch, isInFavorites, movie]);

  return (
    <button onClick={handleOnClick}>
      {isInFavorites
        ? 'Unfavorite'
        : 'Favorite'
      }
    </button>
  );
}

export default FavoriteButton;

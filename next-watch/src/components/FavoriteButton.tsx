'use client';

import { MouseEvent, useCallback, useContext, useEffect, useState } from 'react';

import type { Movie } from '@/models/movie.model';
import * as FavoritesStorage from '@/storage/favorites.storage';
import { FavoritesStateContext, FavoritesDispatchContext } from '@/contexts/favorites/favorites.context';

interface Props {
  movie: Movie;
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

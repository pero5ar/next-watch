'use client';

import {
  createContext, useCallback, useEffect, useReducer, Dispatch, PropsWithChildren,
} from 'react';

import * as FavoritesStorage from '@/storage/favorites.storage';

import { FavoritesAction, FavoritesState } from './favorites.types';

const emptyState = {
  list: [],
  lookup: {},
};

export const FavoritesStateContext = createContext<FavoritesState>(emptyState);

export const FavoritesDispatchContext = createContext<Dispatch<FavoritesAction>>(
  () => { throw new Error('Missing proper context provider value'); }
);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favoritesState, favoritesDispatch] = useReducer(
    (state: FavoritesState, action: FavoritesAction): FavoritesState => {
      switch (action.type) {
        case 'ADD': {
          const { isNew } = FavoritesStorage.save(action.payload);
          const list = isNew ? [...state.list, action.payload.imdbId] : state.list;

          return {
            list,
            lookup: { ...state.lookup, [action.payload.imdbId]: action.payload },
          };
        }
        case 'REMOVE': {
          const exists = FavoritesStorage.remove(action.payload.imdbId);
          if (!exists) {
            return state;
          }

          return {
            list: state.list.filter((item) => item !== action.payload.imdbId),
            lookup: { ...state.lookup, [action.payload.imdbId]: null },
          };
        }

        case 'LOAD': return FavoritesStorage.loadState();
      }
    },
    emptyState // initial state is loaded in useEffect
  );

  const storageEventHandler = useCallback((e: StorageEvent) => {
    if (e.key === null || e.key.startsWith(FavoritesStorage.FAVORITES_STORAGE_PREFIX)) {
      // eslint-disable-next-line no-console
      console.warn('Reloading Favorites State because of storage update in other tab');
      favoritesDispatch({ type: 'LOAD' });
    }
  }, []);

  useEffect(() => {
    // Must load via effect because SSR
    favoritesDispatch({ type: 'LOAD' });
  }, []);

  useEffect(() => {
    // NOTE: this fires only when another window changes the storage
    window.addEventListener('storage', storageEventHandler);

    return () => {
      window.removeEventListener('storage', storageEventHandler);
    };
  }, [storageEventHandler]);

  return (
    <FavoritesDispatchContext.Provider value={favoritesDispatch}>
      <FavoritesStateContext.Provider value={favoritesState}>
        {children}
      </FavoritesStateContext.Provider>
    </FavoritesDispatchContext.Provider>
  );
}

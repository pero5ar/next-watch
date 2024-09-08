'use client';

import type { MovieSuggestion } from '@/models/movieSuggestion.model';

export type { FavoritesState } from '@/storage/favorites.storage';

type AddAction = { type: 'ADD'; payload: MovieSuggestion; };
type RemoveAction = { type: 'REMOVE'; payload: { imdbId: string; }; };
type LoadFromStorageAction = { type: 'LOAD'; };

export type FavoritesAction = AddAction | RemoveAction | LoadFromStorageAction;

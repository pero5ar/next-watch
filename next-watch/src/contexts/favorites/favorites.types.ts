'use client';

import type { Movie } from '@/models/movie.model';

export type { FavoritesState } from '@/storage/favorites.storage';

type AddAction = { type: 'ADD'; payload: Movie; };
type RemoveAction = { type: 'REMOVE'; payload: { imdbId: string; }; };
type LoadFromStorageAction = { type: 'LOAD'; };

export type FavoritesAction = AddAction | RemoveAction | LoadFromStorageAction;

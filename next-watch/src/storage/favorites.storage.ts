'use client';

import type { Movie } from '@/models/movie.model';

export const FAVORITES_STORAGE_PREFIX = 'movies/favorites';

const ID_LIST_STORAGE_KEY = `${FAVORITES_STORAGE_PREFIX}/ids`;
const DATA_LOOKUP_STORAGE_KEY = (imdbId: string) => `${FAVORITES_STORAGE_PREFIX}/dataByImdbId/${imdbId}`;

export interface FavoritesState {
  /** imdbID list */
  list: string[];
  lookup: { [imdbId: string]: Movie | null; };
}

const ERROR_PREFIX = '[Favorites Storage Error]';

export function save(movie: Movie): { isNew: boolean; } {
  if (!movie.imdbId) {
    throw new Error(`${ERROR_PREFIX} Missing IMDB ID`);
  }
  const stringifiedList = window.localStorage.getItem(ID_LIST_STORAGE_KEY);
  const list = JSON.parse<string[]>(stringifiedList || '[]');

  const isNew = !list.includes(movie.imdbId);
  if (isNew) {
    localStorage.setItem(ID_LIST_STORAGE_KEY, JSON.stringify([...list, movie.imdbId]));
  }
  localStorage.setItem(DATA_LOOKUP_STORAGE_KEY(movie.imdbId), JSON.stringify(movie)); // always update

  return { isNew };
}

export function isInFavorites(imdbId: string) {
  const stringifiedMovie = localStorage.getItem((DATA_LOOKUP_STORAGE_KEY(imdbId)));

  return !!stringifiedMovie;
}

/** Returns `false` if item did not exits, true otherwise */
export function remove(imdbId: string): boolean {
  localStorage.removeItem((DATA_LOOKUP_STORAGE_KEY(imdbId))); // remove never breaks

  const stringifiedList = localStorage.getItem(ID_LIST_STORAGE_KEY);
  const list = JSON.parse<string[]>(stringifiedList || '[]');

  const newList = list.filter((item) => item !== imdbId);

  if (list.length === newList.length) {
    // eslint-disable-next-line no-console
    console.warn(`${ERROR_PREFIX} Tried to remove item that does not exists`, { imdbId, list });

    return false; // nothing was removed
  }
  localStorage.setItem(ID_LIST_STORAGE_KEY, JSON.stringify(newList));

  return true;
}

export function loadState() {
  const stringifiedList = localStorage.getItem(ID_LIST_STORAGE_KEY);
  const list = JSON.parse<string[]>(stringifiedList || '[]');

  const lookup = list.reduce<Record<string, Movie>>((acc, id) => {
    const data = JSON.parse<Movie | null>(localStorage.getItem((DATA_LOOKUP_STORAGE_KEY(id))) || 'null');
    if (data) {
      acc[id] = data;
    }

    return acc;
  }, {});

  return { list, lookup };
}

export function getAllFavorites() {
  const stringifiedList = localStorage.getItem(ID_LIST_STORAGE_KEY);
  const list = JSON.parse<string[]>(stringifiedList || '[]');

  return list
    .map((id) => JSON.parse<Movie | null>(localStorage.getItem((DATA_LOOKUP_STORAGE_KEY(id))) || 'null'))
    .filter((item) => !!item);
}

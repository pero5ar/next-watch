'use server';

import { findMovieSuggestions } from '@/services/movie.service';

export async function searchForMovies(query: string) {
  return await findMovieSuggestions(query);
}

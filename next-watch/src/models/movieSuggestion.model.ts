import { MovieSearchResult } from './api/tmdb.apiModels';
import { Movie } from './movie.model';

export type MovieSuggestion = Pick<Movie,
  | 'imdbId'
  | 'tmdbId'
  | 'title'
  | 'year'
  | 'tmdbPosterPath'
>;

export const create = (movie: MovieSearchResult, imdbId: string): MovieSuggestion => ({
  imdbId,
  tmdbId: movie.id,
  title: movie.title,
  year: Number(movie.release_date.substring(0, 4)),
  tmdbPosterPath: movie.poster_path,
});

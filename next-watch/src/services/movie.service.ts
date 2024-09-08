import 'server-only';

import { unstable_cache } from 'next/cache';

import { create as createMovie } from '@/models/movie.model';
import { MovieSuggestion, create as createSuggestion } from '@/models/movieSuggestion.model';
import { SearchResult } from '@/models/api/tmdb.apiModels';

import { randomInt } from '@/utils/number.utils';

import * as TmdbService from './tmdb.service';
import * as OmdbService from './omdb.service';

const ERROR_PREFIX = '[Movie Service Error]';

const MIN_SEARCH_QUERY_LENGTH = 3;
const MAX_SEARCH_RESULT_LENGTH = 5;

/**
 * OMDB has a daily request limit because of which some data might be missing at times.
 * The revalidate time is set to half a day to try again.
 */
const REVALIDATE_MOVIE_AFTER = 12 * 60 * 60;

export async function getMovieByImdbId(imdbId: string) {
  if (!imdbId?.startsWith('tt')) {
    throw new Error(`${ERROR_PREFIX} Invalid IMDB Id`);
  }

  const getMovie = unstable_cache(
    async () => {
      const [tmdbMovie, omdbMovie] = await Promise.all([
        TmdbService.getMovieByImdbId(imdbId),
        OmdbService.getMovieByImdbId(imdbId),
      ]);
      const movie = createMovie({ tmdbMovie, omdbMovie });

      return movie;
    },
    ['movie', imdbId],
    { tags: ['movie'], revalidate: REVALIDATE_MOVIE_AFTER }
  );

  return await getMovie();
}

async function mapSearchResultToMovieSuggestions(
  tmdbSearchResult: SearchResult,
  limit: number,
  start: number = 0
): Promise<MovieSuggestion[]> {
  const movieSuggestionPromises = tmdbSearchResult.results.slice(start, start + limit).map(
    async (tmdbResult) => {
      const imdbId = await TmdbService.getImdbIdByTmdbId(tmdbResult.id);

      return imdbId ? createSuggestion(tmdbResult, imdbId) : null;
    }
  );

  return (await Promise.all(movieSuggestionPromises)).filter((suggestion) => !!suggestion);
}

export async function findMovieSuggestions(query: string): Promise<MovieSuggestion[]> {
  const trimmedQuery = query?.trim() ?? '';
  if (trimmedQuery.length < MIN_SEARCH_QUERY_LENGTH) {
    return [];
  }

  const tmdbSearchResult = await TmdbService.findMovies(trimmedQuery);

  return await mapSearchResultToMovieSuggestions(tmdbSearchResult, MAX_SEARCH_RESULT_LENGTH);
}

const getRandomListPageAndStart = (limit: number) => ({
  page: randomInt(1, 3),
  start: randomInt(0, 20 - limit),
});

export async function getNowPlayingMovies(limit: number, randomize?: boolean) {
  const { page, start } = randomize ? getRandomListPageAndStart(limit) : { page: undefined, start: undefined };
  const tmdbSearchResult = await TmdbService.getList('now_playing', page);

  return await mapSearchResultToMovieSuggestions(tmdbSearchResult, limit, start);
}

export async function getPopularMovies(limit: number, randomize?: boolean) {
  const { page, start } = randomize ? getRandomListPageAndStart(limit) : { page: undefined, start: undefined };
  const tmdbSearchResult = await TmdbService.getList('popular', page);

  return await mapSearchResultToMovieSuggestions(tmdbSearchResult, limit, start);
}

export async function getTopRatedMovies(limit: number, randomize?: boolean) {
  const { page, start } = randomize ? getRandomListPageAndStart(limit) : { page: undefined, start: undefined };
  const tmdbSearchResult = await TmdbService.getList('top_rated', page);

  return await mapSearchResultToMovieSuggestions(tmdbSearchResult, limit, start);
}

import 'server-only';

import { unstable_cache } from 'next/cache';

import { create as createMovie } from '@/models/movie.model';
import * as TmdbService from './tmdb.service';
import * as OmdbService from './omdb.service';

const ERROR_PREFIX = '[Movie Service Error]';

/**
 * OMDB has a daily request limit because of which some data might be missing at times.
 * The revalidate time is set to half a day to try again.
 */
const REVALIDATE_AFTER = 12 * 60 * 60;

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
      console.log({ tmdbMovie, omdbMovie });
      const movie = createMovie({ tmdbMovie, omdbMovie });

      return movie;
    },
    ['movie', imdbId],
    { tags: ['movie'], revalidate: REVALIDATE_AFTER }
  );

  return await getMovie();
}

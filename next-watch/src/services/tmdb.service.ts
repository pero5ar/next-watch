import 'server-only';

import { unstable_cache } from 'next/cache';
import { Genre, MovieWithDetails, SearchResult } from '@/models/api/tmdb.apiModels';

const ERROR_PREFIX = '[TMDB Service Error]';

const getOptions = () => ({
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
  },
});

export async function getMovieByImdbId(imdbId: string) {
  const url = `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`;
  const getMovieDetailsUrl = (id: number | string) => `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`;

  try {
    // NOTE: TMDB seems to accept IMDB IDs directly so first try to fetch like that.
    //       This is however undocumented behavior so the implementation will use it only if there is a result.
    const detailsResponse = await fetch(getMovieDetailsUrl(imdbId), getOptions());
    if (detailsResponse.ok) {
      const movieDetails: MovieWithDetails | undefined = await detailsResponse.json();
      if (!!movieDetails?.id) {
        // NOTE: Checking ID because TMDB can return a successful fail
        return movieDetails;
      }
    }
  } catch {
    // ignore anything form this
  }

  try {
    const findResponse = await fetch(url, getOptions());
    if (!findResponse.ok) {
      console.error(ERROR_PREFIX, { status: findResponse.status });

      return null;
    }
    const movie = await findResponse.json();
    if (!movie?.id) {
      // NOTE: Checking ID because TMDB can return a successful fail
      return null;
    }
    const detailsResponse = await fetch(getMovieDetailsUrl(movie.id), getOptions());
    const movieDetails: MovieWithDetails | undefined = await detailsResponse.json();

    return movieDetails ?? null;
  } catch (err) {
    console.error(ERROR_PREFIX, err);

    return null;
  }
}

export const getGenreLookup = unstable_cache(
  async () => {
    const moveGenresUrl = ' https://api.themoviedb.org/3/genre/movie/list';
    const tvGenresUrl = 'https://api.themoviedb.org/3/genre/tv/list';

    try {
      const [movieGenres, tvGenres] = await Promise.all([
        fetch(moveGenresUrl, getOptions()).then((res) => res.json() as Promise<Genre[]>),
        fetch(tvGenresUrl, getOptions()).then((res) => res.json() as Promise<Genre[]>),
      ]);

      return [...movieGenres, ...tvGenres].reduce(
        (lookup, { id, name }) => ({ ...lookup, [id]: name }),
        {} as { [id: number]: string; }
      );
    } catch (err) {
      console.error(ERROR_PREFIX, err);

      throw new Error('Cannot load genre lookup');
    }
  },
  ['tmdb-genre-lookup']
);

export async function getImdbIdByTmdbId(tmdbId: number): Promise<string | null> {
  // NOTE: no extra caching added because fetch is cached by default
  if (!tmdbId || isNaN(tmdbId)) {
    return null;
  }
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids`;

  try {
    const res = await fetch(url, getOptions());
    if (!res.ok) {
      console.error(ERROR_PREFIX, { status: res.status });

      return null;
    }
    const result = await res.json();

    return result['imdb_id'] ?? null;
  } catch (err) {
    console.error(ERROR_PREFIX, err);

    return null;
  }
}

export async function findMovies(query: string): Promise<SearchResult> {
  const page = 1;
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=${page}`;
  const noResults: SearchResult = {
    page,
    results: [],
    total_pages: 0, // eslint-disable-line camelcase
    total_results: 0, // eslint-disable-line camelcase
  };

  try {
    const res = await fetch(url, getOptions());
    if (!res.ok) {
      console.error(ERROR_PREFIX, { status: res.status });

      return noResults;
    }
    const result = await res.json();

    return result;
  } catch (err) {
    console.error(ERROR_PREFIX, err);

    return noResults;
  }
}

export async function getList(list: 'popular' | 'top_rated' | 'now_playing', page: number = 1) {
  const url = `https://api.themoviedb.org/3/movie/${list}?language=en-US&page=${page}`;
  const noResults: SearchResult = {
    page,
    results: [],
    total_pages: 0, // eslint-disable-line camelcase
    total_results: 0, // eslint-disable-line camelcase
  };

  try {
    const res = await fetch(url, getOptions());
    if (!res.ok) {
      console.error(ERROR_PREFIX, { status: res.status });

      return noResults;
    }
    const result = await res.json();

    return result;
  } catch (err) {
    console.error(ERROR_PREFIX, err);

    return noResults;
  }
}

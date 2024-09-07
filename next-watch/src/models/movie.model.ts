import { Movie as OmdbMovie } from './api/omdb.apiModels';
import { MovieWithDetails as TmdbMovie } from './api/tmdb.apiModels';

type RatingSource = 'IMDB' | 'TMDB' | 'Metacritic' | 'Rotten_Tomatoes';

export interface Movie {
  imdbId: string;
  tmdbId?: number;

  title: string;
  year: number;
  genres: string[];
  countries: string[];
  /** overview or plot */
  description: string;
  /** minutes */
  duration: number;
  /** top 3-5 actors */
  cast: string[] | undefined;

  /** all ratings are mapped to a 0-100 value */
  ratingLookup: Partial<Record<RatingSource, number>>;
  /** 0-100, computed from ratings, favoring some ratings over others (@see {@link create} implementation) */
  score?: number;

  tmdbPosterPath?: string;
  tmdbBackdropPath?: string;
  omdbPosterPath?: string;
}

export const createFromTmdb = (movie: TmdbMovie): Movie => ({
  imdbId: movie.imdb_id,
  tmdbId: movie.id,
  title: movie.title,
  year: Number(movie.release_date.substring(0, 4)),
  genres: movie.genres.map((genre) => genre.name),
  countries: movie.production_countries.map((country) => country.name),
  description: movie.overview,
  duration: movie.runtime,
  cast: movie.credits?.cast?.filter((cast) => cast.order < 5).map((cast) => cast.name) ?? undefined,
  ratingLookup: { 'TMDB': Math.round(10 * movie.vote_average) },
  tmdbPosterPath: movie.poster_path,
  tmdbBackdropPath: movie.backdrop_path,
});

export const createFromOmdb = (movie: OmdbMovie): Movie => ({
  imdbId: movie.imdbID,
  title: movie.Title,
  year: Number(movie.Year),
  genres: movie.Genre.split(', '),
  countries: movie.Country.split(', '),
  description: movie.Plot,
  duration: parseInt(movie.Runtime),
  cast: movie.Actors.split(', '),
  ratingLookup: {
    'IMDB': Math.round(10 * Number(movie.imdbRating)),
    'Metacritic': Number(movie.Metascore),
    'Rotten_Tomatoes': parseInt(movie.Ratings.find((rating) => rating.Source === 'Rotten Tomatoes')?.Value ?? '') || undefined,
  },
  omdbPosterPath: movie.Poster,
});

interface CreateProps {
  tmdbMovie?: Nullable<TmdbMovie>;
  omdbMovie?: Nullable<OmdbMovie>;
}
export const create = ({ tmdbMovie, omdbMovie }: CreateProps) => {
  const movieFromTmdb = tmdbMovie && createFromTmdb(tmdbMovie);
  const movieFromOmdb = omdbMovie && createFromOmdb(omdbMovie);

  const maybeMovie = {
    ...movieFromOmdb, // set OMDB-only fields
    ...movieFromTmdb, // important, make sure to use TMDB for everything that has it
    ratingLookup: { // merge ratings
      ...movieFromTmdb?.ratingLookup,
      ...movieFromOmdb?.ratingLookup,
    },
  };
  if (!maybeMovie.imdbId) {
    return null;
  }

  const movie = maybeMovie as Movie;
  // Use IMDB when available as score
  movie.score = movie.ratingLookup['IMDB'] ?? movie.ratingLookup['TMDB'] ?? undefined;

  return movie;
};

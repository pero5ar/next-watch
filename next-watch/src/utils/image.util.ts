const TMDB_IMAGE_ROOT = 'https://image.tmdb.org/t/p';

const TMDB_POSTER_SIZES = [
  'w92',
  'w154',
  'w185',
  'w342',
  'w500',
  'w780',
  'original',
] as const;
type TmdbPosterSize = (typeof TMDB_POSTER_SIZES)[number];

const NUMERIC_TMDB_POSTER_SIZES = TMDB_POSTER_SIZES.map((size) => Number(size.substring(1)));

function getPosterSize(width?: number): TmdbPosterSize {
  if (!width || isNaN(width)) {
    return 'original';
  }
  const sizeIndex = NUMERIC_TMDB_POSTER_SIZES.findIndex((size) => !Number.isNaN(size) && width < size);

  return TMDB_POSTER_SIZES[sizeIndex] ?? 'original';
}

/**
 * @param path file path as supplied by TMDB API
 * @param width size that will be mapped to first value available in the current API configuration,
 *              defaults to original size if not supplied
 */
export function getTmdbPosterImage(path: string, width?: number) {
  return `${TMDB_IMAGE_ROOT}/${getPosterSize(width)}/${path}`;
}

export function getTmdbBackdropImage(path: string) {
  return `${TMDB_IMAGE_ROOT}/original/${path}`;
}

/**
 * ### Implementation note
 * OMDB uses IMDB's AWS images set to 300px, but that can be manipulated using the following: https://stackoverflow.com/a/73501833/7821979 .
 * AWS handles trying to scale images above their max size.
 *
 * @param path full path as supplied by the OMDB API
 * @param width requested size, defaults to a high number to show original size
 * @returns
 */
export function getOmdbPosterImage(path: string, width?: number) {
  const [baseUrl] = path.split('@._V1_');
  const scaleX = !width || isNaN(width) ? 10_000 : Math.round(width);

  return `${baseUrl}@._V1_SX${Math.max(50, scaleX)}.jpg`;
}

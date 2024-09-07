import 'server-only';

import { Movie } from '@/models/api/omdb.apiModels';

const ERROR_PREFIX = '[OMDB Service Error]';

export async function getMovieByImdbId(imdbId: string) {
  const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(ERROR_PREFIX, { status: res.status });

      return null;
    }
    const movie: Movie | undefined = await res.json();

    if (!!(movie as any).Error) {
      console.error(ERROR_PREFIX, { ...movie });

      return null;
    }

    return movie ?? null;
  } catch (err) {
    console.error(ERROR_PREFIX, err);

    return null;
  }
}

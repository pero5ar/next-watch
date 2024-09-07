'use client';

import Link from 'next/link';

import type { MovieSuggestion } from '@/models/movieSuggestion.model';
import MovieDetailsPreview from '@/components/MovieDetailsPreview/MovieDetailsPreview';

interface Props {
  title?: string;
  movies: MovieSuggestion[];
}

function MovieListSection({ movies, title }: Props) {
  return (
    <section>
      {title && <h2>{title}</h2>}
      {movies.map((movie) => (
        <Link key={movie.imdbId} href={`/movies/details/${movie.imdbId}`}>
          <MovieDetailsPreview movie={movie} canFavorite />
        </Link>
      ))}
    </section>
  );
}

export default MovieListSection;

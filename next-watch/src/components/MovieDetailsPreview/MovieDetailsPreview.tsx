'use client';

import { MovieSuggestion } from '@/models/movieSuggestion.model';
import PosterImage from '@/components/PosterImage';

import styles from './MovieDetailsPreview.module.scss';

interface Props {
  movie: MovieSuggestion;
}

function MovieDetailsPreview({ movie }: Props) {
  return (
    <div className={styles.container}>
      <PosterImage
        name={movie.title}
        width="50"
        tmdbPath={movie.tmdbPosterPath}
        fallback={<div />}
      />
      <div>
        <span>{movie.title}</span>
        <span>({movie.year})</span>
      </div>
    </div>
  );
}

export default MovieDetailsPreview;

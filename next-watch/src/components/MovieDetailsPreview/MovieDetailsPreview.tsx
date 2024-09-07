'use client';

import type { MovieSuggestion } from '@/models/movieSuggestion.model';
import PosterImage from '@/components/PosterImage';

import styles from './MovieDetailsPreview.module.scss';
import FavoriteButton from '../FavoriteButton';

interface Props {
  movie: MovieSuggestion;
  canFavorite?: boolean;
}

function MovieDetailsPreview({ movie, canFavorite }: Props) {
  return (
    <div className={styles.container}>
      <PosterImage
        name={movie.title}
        width="50"
        tmdbPath={movie.tmdbPosterPath}
        fallback={<div />}
      />
      <div>
        <div>
          <span className={styles.title}>{movie.title}</span>
          <span className={styles.year}> ({movie.year})</span>
        </div>
        {canFavorite && <div><FavoriteButton movie={movie} /></div>}
      </div>
    </div>
  );
}

export default MovieDetailsPreview;

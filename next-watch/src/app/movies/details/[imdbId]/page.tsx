import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getMovieByImdbId } from '@/services/movie.service';
import PosterImage from '@/components/PosterImage';

import styles from './page.module.scss';
import Backdrop from './_backdrop';

interface Params {
  imdbId: string;
}

export async function generateMetadata({ params: { imdbId } }: { params: Params; }): Promise<Metadata> {
  const movie = await getMovieByImdbId(imdbId);

  return {
    title: movie?.title ?? 'Movie Details',
  };
}

async function MovieDetails({ params: { imdbId } }: { params: Params; }) {
  const movie = await getMovieByImdbId(imdbId);

  if (!movie) {
    notFound();
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles['title-section']}>
          <h1>{movie.title}</h1>
        </div>
        <div className={styles['poster-section']}>
          <PosterImage
            name={movie.title}
            width="300"
            tmdbPath={movie.tmdbPosterPath}
            omdbPath={movie.omdbPosterPath}
          />
        </div>
        <div className={styles['info-section-one']}>
          <div>
            <span title="Release year">{movie.year}</span>
            <span>, </span>
            <span title="Runtime">{movie.duration} min</span>
          </div>
          <br />
          <div title="Description">
            <span>{movie.description}</span>
          </div>
        </div>
        <div className={styles['info-section-two']}>
          <div className={styles['info-section__row']}>
            <h3>Genre: </h3>
            <span>{movie.genres.join(', ')}</span>
          </div>
          <div className={styles['info-section__row']}>
            <h3>Country: </h3>
            <span>{movie.countries.join(', ')}</span>
          </div>
          <div className={styles['info-section__row']}>
            <h3>Cast: </h3>
            <span>{movie.cast?.join(', ') ?? ''}</span>
          </div>
        </div>
      </div>
      <Backdrop tmdbPath={movie.tmdbBackdropPath} />
    </>
  );
}

export default MovieDetails;

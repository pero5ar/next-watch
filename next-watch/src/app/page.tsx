import * as MovieService from '@/services/movie.service';
import MovieListSection from '@/components/MovieListSection/MovieListSection';

const LIST_LENGTH = 3;

export default async function Home() {
  const [nowPlaying, popular, topRated] = await Promise.all([
    MovieService.getNowPlayingMovies(LIST_LENGTH, true),
    MovieService.getPopularMovies(LIST_LENGTH, true),
    MovieService.getTopRatedMovies(LIST_LENGTH, true),
  ]);

  return (
    <>
      <h1>Welcome to Next Watch</h1>
      <p>Browse and find something that interests you, or use the search feature</p>
      <MovieListSection title="Now in Theatres" movies={nowPlaying} />
      <MovieListSection title="Most Popular" movies={popular} />
      <MovieListSection title="Top Rated" movies={topRated} />
    </>
  );
}

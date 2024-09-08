export interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  /** @example "128 min" */
  Runtime: string;
  /** comma separated list */
  Genre: string;
  Director: string;
  /** comma separated list */
  Writer: string;
  /** comma separated list */
  Actors: string;
  Plot: string;
  /** comma separated list */
  Language: string;
  /** comma separated list */
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  /** @example "92" */
  Metascore: string;
  /** @example "8.9" */
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface Rating {
  Source: string;
  /** depends on source */
  Value: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    TMDB_TOKEN: string;
    OMDB_KEY: string;
  }
}

declare type Nullable<T> = T | null;

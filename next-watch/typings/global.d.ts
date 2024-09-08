declare namespace NodeJS {
  interface ProcessEnv {
    TMDB_TOKEN: string;
    OMDB_KEY: string;
  }
}

declare type Nullable<T> = T | null;

interface _Stringified<T> { }
type Stringified<T> = string & _Stringified<T>;

declare interface JSON {
    parse<T = any>(text: Stringified<T>, reviver?: (key: string, value: any) => any): T;
    stringify<T = any>(value: T, replacer?: (key: string, value: any) => any, space?: string | number): Stringified<T>;
    stringify<T = any>(value: T, replacer?: (number | string)[] | null, space?: string | number): Stringified<T>;
}

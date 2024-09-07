/* eslint-disable react/jsx-no-bind */
'use client';

import { useRef, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'debounce';

import type { MovieSuggestion } from '@/models/movieSuggestion.model';
import MovieDetailsPreview from '@/components/MovieDetailsPreview/MovieDetailsPreview';

import styles from './_search.module.scss';

interface Props {
  search: (query: string) => Promise<MovieSuggestion[]>;
}

function NavbarSearch({ search }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);

  const setInitialState = useCallback(() => {
    setValue('');
    setSuggestions([]);
  }, []);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  }, []);

  const onSuggestionClick = (suggestion: MovieSuggestion) => {
    setInitialState();
    router.push(`/movies/details/${suggestion.imdbId}`);
  };

  // Add a click event listener to the document body to handle clicks outside of the component
  useEffect(() => {
    const handleDocumentClick = (e: any) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        inputRef.current.blur();
        setSuggestions([]);
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const debouncedSearch = debounce(async (value: string) => {
      const movies = await search(value);
      setSuggestions(movies);
    }, 100);

    const trimmedValue = value?.trim() ?? '';
    if (trimmedValue.length > 1) {
      debouncedSearch(value);
    }

    return () => {
      debouncedSearch.clear();
    };
  }, [search, value]);

  return (
    <div className={styles['container']}>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder="Search"
        value={value}
        onChange={handleOnChange}
        onFocus={setInitialState}
      />
      {suggestions.length > 0 && (
        <ul className={styles['result-list']}>
          {suggestions.map((movie) => (
            <li
              key={movie.imdbId}
              className={styles['result-item']}
              onClick={() => onSuggestionClick(movie)}
            >
              <MovieDetailsPreview movie={movie} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NavbarSearch;

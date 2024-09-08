import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

import { FavoritesProvider } from '@/contexts/favorites/favorites.context';

import NavbarSearch from './(navbar)/_search';
import { searchForMovies } from './actions';

import './globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Watch',
  description: 'Movie app built using Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FavoritesProvider>
          <nav>
            <Link href="/">Home</Link>
            <NavbarSearch search={searchForMovies} />
            <Link href="/movies/favorites">Favorites</Link>
          </nav>
          <main>
            {children}
          </main>
        </FavoritesProvider>
      </body>
    </html>
  );
}

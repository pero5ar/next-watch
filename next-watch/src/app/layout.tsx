import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
            <NavbarSearch search={searchForMovies} />
          </nav>
          <main>
            {children}
          </main>
        </FavoritesProvider>
      </body>
    </html>
  );
}

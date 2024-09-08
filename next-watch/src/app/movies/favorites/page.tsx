import type { Metadata } from 'next';

import FavoritesSection from './_favoritesSection';

export const metadata: Metadata = {
  title: 'Next Watch',
  description: 'Movie app built using Next.js',
};

function FavoritesList() {
  return (
    <div>
      <h1>Favorite Movies</h1>
      <FavoritesSection />
    </div>
  );
}

export default FavoritesList;

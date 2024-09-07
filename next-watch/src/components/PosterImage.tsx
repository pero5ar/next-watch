'use client';

import Image from 'next/image';
import { getTmdbPosterImage, getOmdbPosterImage } from '@/utils/image.util';

interface Props {
  name?: string;
  width: '50' | '300' | 'fill';
  tmdbPath: string | undefined;
  omdbPath: string | undefined;
}

const HEIGHT_TO_WIDTH_RATIO = 1.5;

function PosterImage({
  name, width, tmdbPath, omdbPath,
}: Props) {
  const numericWidth = width === 'fill' ? undefined : Number(width);

  let src = null;
  if (!!tmdbPath) {
    src = getTmdbPosterImage(tmdbPath, numericWidth);
  } else if (!!omdbPath) {
    src = getOmdbPosterImage(omdbPath, numericWidth);
  }

  if (!src) {
    return null;
  }
  const sizeProps = numericWidth === undefined
    ? { fill: true }
    : { width: numericWidth, height: Math.round(numericWidth * HEIGHT_TO_WIDTH_RATIO) };

  return (
    <Image
      src={src}
      alt={`${name} poster image`}
      {...sizeProps}
    />
  );
}

export default PosterImage;

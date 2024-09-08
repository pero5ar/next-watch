'use-client';

import Image from 'next/image';
import { getTmdbBackdropImage } from '@/utils/image.util';

import styles from './_backdrop.module.scss';

interface Props {
  tmdbPath: string | undefined;
}

function Backdrop({ tmdbPath }: Props) {
  if (!tmdbPath) {
    return null;
  }

  return (
    <div className={styles['container']}>
      <Image
        src={getTmdbBackdropImage(tmdbPath)}
        height={675}
        width={1200}
        alt=""
        loading="lazy"
        className={styles['image']}
      />
    </div>
  );
}

export default Backdrop;

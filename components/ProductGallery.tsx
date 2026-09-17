'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="pdp-gallery">
        <div className="pdp-main">
          <span className="thumb-fallback">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pdp-gallery">
      <div className="pdp-main">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          width={720}
          height={720}
          priority
          sizes="(max-width: 880px) 90vw, 520px"
        />
      </div>

      {images.length > 1 && (
        <div className="pdp-thumbs">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={index === active ? 'is-active' : undefined}
              onClick={() => setActive(index)}
              aria-label={`Show ${name} view ${index + 1}`}
              aria-pressed={index === active}
            >
              <Image src={src} alt="" width={74} height={74} sizes="74px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

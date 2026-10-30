import Image, { type StaticImageData } from 'next/image';

type CategoryImageProps = {
  image: string | StaticImageData | null;
  alt: string;
  sizes: string;
  priority?: boolean;
};

/** Renders either bundled brand art or a remote CMS/product image. */
export default function CategoryImage({ image, alt, sizes, priority }: CategoryImageProps) {
  if (!image) return <span className="thumb-fallback">MSD</span>;

  return typeof image === 'string' ? (
    <Image src={image} alt={alt} width={640} height={640} sizes={sizes} priority={priority} />
  ) : (
    <Image src={image} alt={alt} sizes={sizes} priority={priority} />
  );
}

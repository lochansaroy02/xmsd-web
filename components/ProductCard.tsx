import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from './icons';
import { formatPrice, type ProductListItem } from '@/lib/api';

type ProductCardProps = {
  product: ProductListItem;
  /** Card images above the fold get eager loading. */
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const hasDeal = product.mrp > product.sale_price;

  return (
    <article className="prod-card">
      {product.is_featured === 1 && <span className="badge">Bestseller</span>}
      {hasDeal && product.discount > 0 && (
        <span className="badge berry right">{product.discount}% off</span>
      )}

      <Link href={`/products/${product.slug}`} className="prod-thumb" aria-label={product.name}>
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={320}
            height={320}
            priority={priority}
            sizes="(max-width: 480px) 80vw, (max-width: 860px) 44vw, (max-width: 1100px) 30vw, 250px"
          />
        ) : (
          <span className="thumb-fallback">XMSD</span>
        )}
      </Link>

      <span className="prod-cat">{product.category}</span>
      <h4>
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
      </h4>
      <p className="desc">
        {hasDeal ? `Save ${formatPrice(product.mrp - product.sale_price)}` : 'In the current lineup'}
      </p>

      <div className="prod-foot">
        <span className="price">
          {hasDeal && <span className="old">{formatPrice(product.mrp)}</span>}
          {formatPrice(product.sale_price)}
        </span>
        <Link href={`/products/${product.slug}`} className="add-btn" aria-label={`View ${product.name}`}>
          <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

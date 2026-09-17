import Link from 'next/link';
import ProductCard from './ProductCard';
import { ArrowIcon } from './icons';
import type { ProductListItem } from '@/lib/api';

export default function Bestsellers({ products }: { products: ProductListItem[] }) {
  // Featured tools lead, then the deepest discounts fill the row of eight.
  const picks = [...products]
    .sort((a, b) => b.is_featured - a.is_featured || b.discount - a.discount || a.name.localeCompare(b.name))
    .slice(0, 8);

  return (
    <section className="section wrap" id="bestsellers">
      <div className="section-head">
        <div>
          <span className="section-tag">Best sellers</span>
          <h2>What&apos;s in the kit bag right now.</h2>
        </div>
        <p>
          The eight tools stylists and technicians reorder the most, pulled live from the XMSD catalogue.
        </p>
      </div>

      {picks.length > 0 ? (
        <>
          <div className="prod-grid">
            {picks.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
          <div style={{ marginTop: 44 }}>
            <Link href="/products" className="btn btn-outline">
              View all {products.length} tools
              <ArrowIcon className="btn-arrow" />
            </Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h4>The catalogue is taking a moment.</h4>
          <p>Product data could not be loaded right now — please refresh in a minute.</p>
        </div>
      )}
    </section>
  );
}

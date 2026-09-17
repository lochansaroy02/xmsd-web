import Link from 'next/link';
import CategoryImage from './CategoryImage';
import { formatPrice } from '@/lib/api';
import type { Category } from '@/lib/categories';

/** Card sizes for the 6-column grid: a 2×2 lead card, then 2-wide cards. */
function cardClass(index: number, total: number): string {
  if (index === 0) return 'cat-a';
  // An odd number of trailing cards leaves a gap on the last row; widen the final one.
  const trailing = total - 1;
  if (index === total - 1 && trailing % 2 === 1) return 'cat-b cat-wide';
  return 'cat-b';
}

export default function Categories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <section className="section wrap" id="categories">
      <div className="section-head">
        <div>
          <span className="section-tag">Shop by category</span>
          <h2>Every station, one supplier.</h2>
        </div>
        <p>
          {categories.length} categories and {total} tools that cover a stylist&apos;s chair, a therapist&apos;s
          bed, and a nail technician&apos;s bench.
        </p>
      </div>
      <div className="cat-grid">
        {categories.map((category, index) => (
          <Link
            href={`/category/${category.slug}`}
            className={`cat-card ${cardClass(index, categories.length)}`}
            key={category.slug}
          >
            <CategoryImage
              image={category.image}
              alt={`XMSD ${category.name}`}
              sizes="(max-width: 880px) 50vw, 25vw"
            />
            <h4>{category.name}</h4>
            <span className="num">
              {category.count} tools · from {formatPrice(category.fromPrice)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

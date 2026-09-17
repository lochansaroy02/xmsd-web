import Link from 'next/link';
import CategoryImage from './CategoryImage';
import type { Category } from '@/lib/categories';

type CategoryStripProps = {
  categories: Category[];
  /** Slug of the category being viewed, if any. */
  active?: string;
};

export default function CategoryStrip({ categories, active }: CategoryStripProps) {
  if (categories.length === 0) return null;

  return (
    <nav className="cat-strip" aria-label="Product categories">
      {categories.map((category) => {
        const isActive = category.slug === active;
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className={`cat-tile${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="cat-tile-img">
              <CategoryImage image={category.image} alt="" sizes="64px" />
            </span>
            <span className="cat-tile-copy">
              <b>{category.name}</b>
              <span className="num">{category.count} tools</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

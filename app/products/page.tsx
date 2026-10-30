import type { Metadata } from 'next';
import CategoryStrip from '@/components/CategoryStrip';
import ProductCatalogue from '@/components/ProductCatalogue';
import { getProducts } from '@/lib/api';
import { getBrandCategories } from '@/lib/categories';

export const metadata: Metadata = {
  title: 'All products',
  description: 'The full MSD tool catalogue — hair, skin & body, and manicure tools.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [products, categories, params] = await Promise.all([getProducts(), getBrandCategories(), searchParams]);

  return (
    <section className="section wrap" style={{ paddingTop: 70 }}>
      <div className="section-head">
        <div>
          <span className="section-tag">The full range</span>
          <h2>Every MSD tool, in one place.</h2>
        </div>
        <p>
          Live from the MSD catalogue — pick a category, search by tool, or sort by price and saving.
        </p>
      </div>

      <CategoryStrip categories={categories} />

      <ProductCatalogue products={products} initialQuery={params.q ?? ''} />
    </section>
  );
}

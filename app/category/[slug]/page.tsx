import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CategoryImage from '@/components/CategoryImage';
import CategoryStrip from '@/components/CategoryStrip';
import ProductCatalogue from '@/components/ProductCatalogue';
import { ArrowIcon } from '@/components/icons';
import { formatPrice } from '@/lib/api';
import { getBrandCategories } from '@/lib/categories';

export async function generateStaticParams() {
  const categories = await getBrandCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getBrandCategories()).find((c) => c.slug === slug);
  if (!category) return { title: 'Category not found' };

  return {
    title: category.name,
    description: `${category.count} professional ${category.name.toLowerCase()} from XMSD, from ${formatPrice(category.fromPrice)}.`,
    openGraph: typeof category.image === 'string' ? { images: [category.image] } : undefined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getBrandCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) notFound();

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/products">All products</Link>
        <span aria-hidden>/</span>
        <span>{category.name}</span>
      </nav>

      <section className="feature cat-hero">
        <div className="feature-copy">
          <span className="section-tag">Shop by category</span>
          <h1>{category.name}</h1>
          <p>
            {category.count} XMSD {category.name.toLowerCase()} built for a full day at the station — every one
            listed live from the catalogue, from {formatPrice(category.fromPrice)}.
          </p>
          <div className="feature-cta">
            <a href="#range" className="btn btn-solid">
              Shop the range
              <ArrowIcon className="btn-arrow" />
            </a>
            <Link href="/products" className="btn btn-outline">
              All products
            </Link>
          </div>
          <div className="feature-stats">
            <div>
              <b>{category.count}</b>
              <span>Tools in this line</span>
            </div>
            <div>
              <b>{formatPrice(category.fromPrice)}</b>
              <span>Starting price</span>
            </div>
            {category.topDiscount > 0 && (
              <div>
                <b>{category.topDiscount}%</b>
                <span>Best saving on MRP</span>
              </div>
            )}
          </div>
        </div>
        <div className="feature-img">
          <CategoryImage
            image={category.image}
            alt={`XMSD ${category.name}`}
            sizes="(max-width: 880px) 80vw, 40vw"
            priority
          />
        </div>
      </section>

      <CategoryStrip categories={categories} active={category.slug} />

      <section id="range" className="section cat-range">
        <ProductCatalogue products={category.products} itemLabel={category.name.toLowerCase()} />
      </section>
    </div>
  );
}

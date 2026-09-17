import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';
import { ArrowIcon } from '@/components/icons';
import { formatPrice, galleryImages, getProduct, getProducts } from '@/lib/api';
import { getBrandCategories } from '@/lib/categories';
import { sanitizeHtml } from '@/lib/sanitize';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Product not found' };

  return {
    title: product.name,
    description: product.short_description ?? `${product.name} — ${product.brand?.name ?? 'XMSD'} professional tool.`,
    openGraph: {
      title: product.name,
      images: product.main_image ? [product.main_image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([getProduct(slug), getBrandCategories()]);

  if (!product) notFound();

  const category = categories.find((c) => c.name === product.category?.name);

  const images = galleryImages(product);
  const hasDeal = product.mrp > product.sale_price;
  const variant = product.variants[0];
  const inStock = product.variants.some((v) => v.stock > 0);
  // Related tools come from the same category first, topped up from the rest of the range.
  const others = categories.flatMap((c) => c.products).filter((p) => p.slug !== product.slug);
  const related = [
    ...others.filter((p) => p.category === product.category?.name),
    ...others.filter((p) => p.category !== product.category?.name),
  ].slice(0, 4);

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/products">All products</Link>
        {category && (
          <>
            <span aria-hidden>/</span>
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </>
        )}
        <span aria-hidden>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <ProductGallery images={images} name={product.name} />

        <div className="pdp-info">
          {category ? (
            <Link href={`/category/${category.slug}`} className="section-tag" style={{ marginBottom: 0 }}>
              {category.name}
            </Link>
          ) : (
            <span className="section-tag" style={{ marginBottom: 0 }}>
              {product.category?.name ?? 'Tools & Accessories'}
            </span>
          )}
          <h1>{product.name}</h1>
          {product.short_description && product.short_description !== product.name && (
            <p className="pdp-short">{product.short_description}</p>
          )}

          <div className="pdp-price">
            <span className="now">{formatPrice(product.sale_price)}</span>
            {hasDeal && <span className="was">{formatPrice(product.mrp)}</span>}
            {hasDeal && product.discount > 0 && <span className="save">{product.discount}% off</span>}
          </div>

          <div className="pdp-meta">
            <div>
              <span>Brand</span>
              <b>{product.brand?.name ?? 'XMSD'}</b>
            </div>
            {variant?.sku && (
              <div>
                <span>SKU</span>
                <b className="num">{variant.sku}</b>
              </div>
            )}
            <div>
              <span>Availability</span>
              <b style={{ color: inStock ? undefined : 'var(--berry)' }}>
                {inStock ? 'In stock' : 'Made to order'}
              </b>
            </div>
            {hasDeal && (
              <div>
                <span>You save</span>
                <b className="num">{formatPrice(product.mrp - product.sale_price)}</b>
              </div>
            )}
          </div>

          <div className="pdp-actions">
            <a
              href={`https://barbersyndicate.in/product/${product.slug}`}
              className="btn btn-solid"
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire / order
              <ArrowIcon className="btn-arrow" />
            </a>
            <Link href={category ? `/category/${category.slug}` : '/products'} className="btn btn-outline">
              {category ? `More ${category.name.toLowerCase()}` : 'Back to all tools'}
            </Link>
          </div>

          {product.description && (
            <div className="detail-block">
              <h3>Product details</h3>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
              />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <span className="section-tag">Pairs well with</span>
              <h2>More from the bench.</h2>
            </div>
          </div>
          <div className="prod-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

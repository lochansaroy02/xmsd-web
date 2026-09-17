export const API_BASE = 'https://barbersyndicate.in/api';
export const BRAND_SLUG = 'msd';

/** Revalidate product data every 10 minutes. */
export const REVALIDATE = 600;

export type ProductListItem = {
  id: number;
  name: string;
  slug: string;
  sale_price: number;
  mrp: number;
  discount: number;
  is_featured: number;
  brand: string;
  category: string;
  thumbnail: string | null;
};

export type ProductVariant = {
  id: number;
  sku: string | null;
  sale_price: number;
  mrp: number;
  stock: number;
  images: string[];
  attributes: { name?: string; value?: string }[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  sale_price: number;
  mrp: number;
  discount: number;
  is_featured: number;
  brand: { id: number; name: string } | null;
  category: { id: number; name: string } | null;
  main_image: string | null;
  images: string[];
  variants: ProductVariant[];
};

type BrandResponse = {
  success: boolean;
  brand: { id: number; name: string; slug: string };
  data: ProductListItem[];
  meta: { current_page: number; last_page: number; total: number; per_page: number };
};

type ProductResponse = { success: boolean; data: Product };

async function fetchBrandPage(page: number): Promise<BrandResponse | null> {
  const url = `${API_BASE}/products/brand/${BRAND_SLUG}?page=${page}`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    console.error(`[api] ${url} responded ${res.status}`);
    return null;
  }

  const json = (await res.json()) as BrandResponse;
  return json.success && Array.isArray(json.data) ? json : null;
}

/**
 * Every product for the MSD brand. The endpoint paginates, so read `last_page`
 * from the first response and fetch the remaining pages in parallel.
 */
export async function getProducts(): Promise<ProductListItem[]> {
  const first = await fetchBrandPage(1);
  if (!first) return [];

  const lastPage = first.meta?.last_page ?? 1;
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, lastPage - 1) }, (_, i) => fetchBrandPage(i + 2)),
  );

  return [first, ...rest].flatMap((page) => page?.data ?? []);
}

/** Most keyword-search pages to read; queries this broad are noise anyway. */
const MAX_SEARCH_PAGES = 5;

/**
 * The API's keyword search, which also matches words that aren't in the product
 * name (e.g. "callus" finds foot files). It spans every brand, so callers must
 * scope the results to the MSD catalogue.
 */
export async function searchKeywords(query: string): Promise<ProductListItem[]> {
  const fetchPage = async (page: number) => {
    const url = `${API_BASE}/products/search?q=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) {
      console.error(`[api] ${url} responded ${res.status}`);
      return null;
    }
    const json = (await res.json()) as BrandResponse;
    return json.success && Array.isArray(json.data) ? json : null;
  };

  const first = await fetchPage(1);
  if (!first) return [];

  const lastPage = Math.min(first.meta?.last_page ?? 1, MAX_SEARCH_PAGES);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, lastPage - 1) }, (_, i) => fetchPage(i + 2)),
  );

  return [first, ...rest].flatMap((page) => page?.data ?? []);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/products/${slug}`, {
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as ProductResponse;
  return json.success && json.data ? json.data : null;
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

/** Gallery images for a product, main image first and duplicates removed. */
export function galleryImages(product: Product): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of [product.main_image, ...product.images]) {
    if (src && !seen.has(src)) {
      seen.add(src);
      out.push(src);
    }
  }
  return out;
}

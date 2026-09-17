import type { StaticImageData } from 'next/image';
import { API_BASE, REVALIDATE, getProducts, type ProductListItem } from './api';
import { footFile, manicureSet, paddleBrushLineup } from './images';

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  image: string;
  children?: ApiCategory[];
};

export type Category = {
  name: string;
  slug: string;
  /** CMS image, else brand art, else a product photo from the category. */
  image: string | StaticImageData | null;
  count: number;
  fromPrice: number;
  topDiscount: number;
  products: ProductListItem[];
};

/** Just what navigation needs — keeps product arrays out of client props. */
export type CategoryLink = Pick<Category, 'name' | 'slug' | 'count'>;

/**
 * Brand art for categories the CMS has no image for. Keyed by API slug; a CMS
 * image always wins, so uploading one in the admin replaces these automatically.
 */
const brandArt: Record<string, StaticImageData> = {
  'hair-tools': paddleBrushLineup,
  'skin-body-tools': footFile,
  'manicure-tools': manicureSet,
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getCategoryTree(): Promise<ApiCategory[]> {
  const url = `${API_BASE}/categories`;
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    console.error(`[api] ${url} responded ${res.status}`);
    return [];
  }

  const json = (await res.json()) as { success: boolean; data: ApiCategory[] };
  if (!json.success || !Array.isArray(json.data)) return [];

  return json.data.flatMap((parent) => [parent, ...(parent.children ?? [])]);
}

/**
 * The categories that actually hold MSD products, largest first. Product list
 * items only carry the category name, so slugs and images are joined in from
 * the category tree.
 */
export async function getBrandCategories(): Promise<Category[]> {
  const [products, tree] = await Promise.all([getProducts(), getCategoryTree()]);
  const byName = new Map(tree.map((c) => [c.name.trim().toLowerCase(), c]));

  const groups = new Map<string, ProductListItem[]>();
  for (const product of products) {
    const list = groups.get(product.category);
    if (list) list.push(product);
    else groups.set(product.category, [product]);
  }

  return [...groups.entries()]
    .map(([name, items]): Category => {
      const meta = byName.get(name.trim().toLowerCase());
      const slug = meta?.slug || slugify(name);
      const cover = items.find((p) => p.is_featured === 1 && p.thumbnail) ?? items.find((p) => p.thumbnail);

      return {
        name,
        slug,
        image: meta?.image || brandArt[slug] || cover?.thumbnail || null,
        count: items.length,
        fromPrice: Math.min(...items.map((p) => p.sale_price)),
        topDiscount: Math.max(...items.map((p) => p.discount)),
        products: items,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function getCategory(slug: string): Promise<Category | null> {
  const categories = await getBrandCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export function toLinks(categories: Category[]): CategoryLink[] {
  return categories.map(({ name, slug, count }) => ({ name, slug, count }));
}

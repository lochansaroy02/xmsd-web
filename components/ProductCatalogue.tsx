'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { SearchIcon } from './icons';
import type { ProductListItem } from '@/lib/api';
import { MIN_KEYWORD_QUERY, searchByName, type SearchResponse } from '@/lib/search';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'name';

const sorts: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'discount', label: 'Biggest saving' },
  { value: 'name', label: 'Name A–Z' },
];

function compare(a: ProductListItem, b: ProductListItem, sort: SortKey): number {
  switch (sort) {
    case 'price-asc':
      return a.sale_price - b.sale_price;
    case 'price-desc':
      return b.sale_price - a.sale_price;
    case 'discount':
      return b.discount - a.discount;
    case 'name':
      return a.name.localeCompare(b.name);
    default:
      return b.is_featured - a.is_featured || a.name.localeCompare(b.name);
  }
}

export default function ProductCatalogue({
  products,
  initialQuery = '',
  itemLabel = 'tools',
}: {
  products: ProductListItem[];
  initialQuery?: string;
  /** Noun used in the result count, e.g. "hair tools". */
  itemLabel?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>('featured');
  const [keyword, setKeyword] = useState<{ query: string; slugs: string[] } | null>(null);

  // A header search while already on this page arrives as a new initialQuery.
  useEffect(() => setQuery(initialQuery), [initialQuery]);

  const q = query.trim();

  // Name matches are computed locally; keyword matches (words in descriptions) come from the API.
  useEffect(() => {
    if (q.length < MIN_KEYWORD_QUERY) {
      setKeyword(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`search responded ${res.status}`);
        const json = (await res.json()) as SearchResponse;
        setKeyword({ query: q, slugs: json.results.filter((r) => r.match === 'keyword').map((r) => r.slug) });
      } catch (error) {
        // Name matches still work without the API; just record that no keyword hits arrived.
        if ((error as Error).name !== 'AbortError') setKeyword({ query: q, slugs: [] });
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  // Keep ?q= in the address bar so a search can be shared or reloaded.
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = new URL(window.location.href);
      if (q) url.searchParams.set('q', q);
      else url.searchParams.delete('q');
      if (url.href !== window.location.href) window.history.replaceState(null, '', url);
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  const keywordPending = q.length >= MIN_KEYWORD_QUERY && keyword?.query !== q;

  const visible = useMemo(() => {
    if (!q) return [...products].sort((a, b) => compare(a, b, sort));

    const named = searchByName(products, q);
    const seen = new Set(named.map((p) => p.slug));
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const related =
      keyword?.query === q
        ? keyword.slugs
            .filter((slug) => !seen.has(slug))
            .map((slug) => bySlug.get(slug))
            .filter((p): p is ProductListItem => Boolean(p))
        : [];

    const matched = [...named, ...related];
    // "Featured first" becomes "Best match" while searching, keeping relevance order.
    return sort === 'featured' ? matched : matched.sort((a, b) => compare(a, b, sort));
  }, [products, q, keyword, sort]);

  return (
    <>
      <div className="catalogue-bar">
        <div className="search-field">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or keyword — scissor, callus, comb…"
            aria-label="Search products by name or keyword"
          />
        </div>

        <div className="control-group">
          <span className="result-count num">
            {visible.length} of {products.length} {itemLabel}
          </span>
          <label className="control-label" htmlFor="sort">
            Sort
          </label>
          <div className="select-field">
            <select id="sort" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
              {sorts.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value === 'featured' && q ? 'Best match' : option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="prod-grid">
          {visible.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h4>The catalogue is taking a moment.</h4>
          <p>Product data could not be loaded right now — please refresh in a minute.</p>
        </div>
      ) : keywordPending ? (
        <div className="empty-state">
          <h4>Searching for “{q}”…</h4>
          <p>Checking product names and keywords.</p>
        </div>
      ) : (
        <div className="empty-state">
          <h4>No tools match “{q}”.</h4>
          <p>Try a shorter word or a keyword like “scissor”, “comb”, or “file”.</p>
        </div>
      )}
    </>
  );
}

import { NextResponse, type NextRequest } from 'next/server';
import { getProducts, searchKeywords, type ProductListItem } from '@/lib/api';
import {
  MIN_KEYWORD_QUERY,
  countMatchedTokens,
  searchByName,
  type SearchResponse,
  type SearchResult,
} from '@/lib/search';

const MAX_QUERY_LENGTH = 80;

function toResult(product: ProductListItem, match: SearchResult['match']): SearchResult {
  const { id, name, slug, sale_price, mrp, category, thumbnail } = product;
  return { id, name, slug, sale_price, mrp, category, thumbnail, match };
}

/**
 * GET /api/search?q=scissor&limit=6
 * Name matches from the MSD catalogue first, then the API's keyword matches
 * that are also MSD products. `limit` is optional; omit it for every result.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get('q') ?? '').trim().slice(0, MAX_QUERY_LENGTH);
  const limit = Math.max(0, Math.min(Number(params.get('limit')) || 0, 50));

  if (!query) {
    return NextResponse.json<SearchResponse>({ query, total: 0, results: [] });
  }

  const [products, keywordHits] = await Promise.all([
    getProducts(),
    query.length >= MIN_KEYWORD_QUERY ? searchKeywords(query) : Promise.resolve([]),
  ]);

  const named = searchByName(products, query);
  const seen = new Set(named.map((p) => p.slug));
  const catalogue = new Map(products.map((p) => [p.slug, p]));

  // Look keyword hits up in the catalogue: that scopes them to MSD and keeps the data consistent.
  const keyword = keywordHits
    .filter((hit) => !seen.has(hit.slug) && seen.add(hit.slug))
    .map((hit) => catalogue.get(hit.slug))
    .filter((p): p is ProductListItem => Boolean(p))
    // The API matches any word, so put hits sharing more of the query's words first (stable sort keeps API order).
    .sort((a, b) => countMatchedTokens(b, query) - countMatchedTokens(a, query));

  const results = [...named.map((p) => toResult(p, 'name')), ...keyword.map((p) => toResult(p, 'keyword'))];

  return NextResponse.json<SearchResponse>(
    { query, total: results.length, results: limit ? results.slice(0, limit) : results },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
  );
}

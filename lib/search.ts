/**
 * Product name search shared by the header search, the /api/search route, and
 * the catalogue filter, so all three rank results the same way. Pure functions
 * only — this module is imported by client components.
 */

type Searchable = {
  name: string;
  category: string;
  brand?: string;
  is_featured: number;
};

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9.]+/g, ' ')
    .replace(/(^|\s)\.+|\.+(\s|$)/g, ' ')
    .trim();
}

/** Unique search words, e.g. "Pink  foot-file" → ["pink", "foot", "file"]. */
export function tokenize(query: string): string[] {
  return [...new Set(normalize(query).split(' ').filter(Boolean))];
}

/** The token plus a naive singular, so "scissors" and "combs" still match. */
function variants(token: string): string[] {
  if (token.length > 4 && token.endsWith('es')) return [token, token.slice(0, -2), token.slice(0, -1)];
  if (token.length > 3 && token.endsWith('s')) return [token, token.slice(0, -1)];
  return [token];
}

/** A token matches when some word starts with it: "cut" finds "cutting" and "cutter". */
function matchesWords(words: string[], token: string): boolean {
  const forms = variants(token);
  return words.some((word) => forms.some((form) => word.startsWith(form)));
}

/** Relevance of one item for a query; 0 means it does not match. */
export function scoreByName(item: Searchable, query: string): number {
  const tokens = tokenize(query);
  if (tokens.length === 0) return 0;

  const name = normalize(item.name);
  const nameWords = name.split(' ');
  const contextWords = normalize(`${item.category} ${item.brand ?? ''} msd`).split(' ');

  let score = 0;
  for (const token of tokens) {
    const inName = matchesWords(nameWords, token);
    // Every word in the query has to land somewhere.
    if (!inName && !matchesWords(contextWords, token)) return 0;
    score += inName ? 10 : 3;
    if (nameWords.includes(token)) score += 2;
  }

  const phrase = tokens.join(' ');
  if (name === phrase) score += 100;
  else if (name.startsWith(phrase)) score += 40;
  else if (name.includes(phrase)) score += 20;

  return score + item.is_featured;
}

/** How many query words appear in the item's name or category — ranks partial matches. */
export function countMatchedTokens(item: Searchable, query: string): number {
  const words = normalize(`${item.name} ${item.category}`).split(' ');
  return tokenize(query).filter((token) => matchesWords(words, token)).length;
}

/** Items whose name (or category) matches every word of the query, best first. */
export function searchByName<T extends Searchable>(items: T[], query: string): T[] {
  return items
    .map((item) => ({ item, score: scoreByName(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .map((entry) => entry.item);
}

/** Splits text into plain and matched runs so callers can wrap hits in <mark>. */
export function highlightParts(text: string, query: string): { text: string; hit: boolean }[] {
  const tokens = tokenize(query).flatMap(variants).sort((a, b) => b.length - a.length);
  if (tokens.length === 0) return [{ text, hit: false }];

  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(?<![a-z0-9])(${escaped.join('|')})`, 'gi');

  const parts: { text: string; hit: boolean }[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), hit: false });
    parts.push({ text: match[0], hit: true });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), hit: false });
  return parts;
}

export const MIN_KEYWORD_QUERY = 2;

export type SearchResult = {
  id: number;
  name: string;
  slug: string;
  sale_price: number;
  mrp: number;
  category: string;
  thumbnail: string | null;
  /** "name": matched the product name; "keyword": matched by the API's keyword search. */
  match: 'name' | 'keyword';
};

export type SearchResponse = {
  query: string;
  total: number;
  results: SearchResult[];
};

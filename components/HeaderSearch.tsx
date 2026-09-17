"use client";

import { formatPrice } from "@/lib/api";
import { highlightParts, type SearchResponse } from "@/lib/search";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowIcon, CloseIcon, SearchIcon } from "./icons";

const PREVIEW_LIMIT = 6;
const DEBOUNCE_MS = 180;

type Status = "idle" | "loading" | "done" | "error";

export default function HeaderSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<SearchResponse | null>(null);

  useEffect(() => inputRef.current?.focus(), []);

  // Live preview: debounce keystrokes and drop responses for stale queries.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setStatus("idle");
      setData(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=${PREVIEW_LIMIT}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`search responded ${res.status}`);
        setData((await res.json()) as SearchResponse);
        setStatus("done");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const seeAll = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    onClose();
  };

  const focusResult = (index: number) => {
    const items = listRef.current?.querySelectorAll<HTMLAnchorElement>(".search-result");
    if (!items || items.length === 0) return;
    if (index < 0) inputRef.current?.focus();
    else items[Math.min(index, items.length - 1)].focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    const items = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>(".search-result") ?? []);
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    event.preventDefault();
    focusResult(event.key === "ArrowDown" ? current + 1 : current - 1);
  };

  const q = query.trim();
  const preview = data?.query === q ? data : null;

  return (
    <>
      <div className="search-backdrop" onClick={onClose} aria-hidden />
      <div className="search-panel" role="dialog" aria-label="Search products" onKeyDown={onKeyDown}>
        <div className="search-inner">
          <form
            className="search-form"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              seeAll();
            }}
          >
            <SearchIcon />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or keyword — scissor, callus, comb…"
              aria-label="Search products by name or keyword"
              aria-controls="search-results"
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" className="search-close" onClick={onClose} aria-label="Close search">
              <kbd>Esc</kbd>
              <CloseIcon />
            </button>
          </form>

          {q && (
            <div className="search-meta" aria-live="polite">
              {status === "error" ? (
                <span>Search is unavailable right now — try again in a moment.</span>
              ) : preview ? (
                <span className="num">
                  {preview.total} {preview.total === 1 ? "product" : "products"} for “{preview.query}”
                </span>
              ) : (
                <span>Searching…</span>
              )}
              {preview && preview.total > 0 && (
                <button type="button" className="search-all-link" onClick={seeAll}>
                  See all results
                  <ArrowIcon className="btn-arrow" />
                </button>
              )}
            </div>
          )}

          {preview && preview.total === 0 && (
            <div className="search-empty">
              <b>No products match “{preview.query}”.</b>
              <span>Try a shorter word or a keyword like “scissor”, “comb”, or “file”.</span>
            </div>
          )}

          {preview && preview.results.length > 0 && (
            <ul id="search-results" className="search-results" ref={listRef}>
              {preview.results.map((result) => (
                <li key={result.slug}>
                  <Link href={`/products/${result.slug}`} className="search-result" onClick={onClose}>
                    <span className="search-thumb">
                      {result.thumbnail ? (
                        <Image src={result.thumbnail} alt="" width={56} height={56} sizes="56px" />
                      ) : null}
                    </span>
                    <span className="search-copy">
                      <b>
                        {highlightParts(result.name, preview.query).map((part, i) =>
                          part.hit ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
                        )}
                      </b>
                      <span>
                        {result.category}
                        {result.match === "keyword" && " · Keyword match"}
                      </span>
                    </span>
                    <span className="price">{formatPrice(result.sale_price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

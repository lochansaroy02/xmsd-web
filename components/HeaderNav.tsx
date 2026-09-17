"use client";

import type { CategoryLink } from "@/lib/categories";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderSearch from "./HeaderSearch";
import { ArrowIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

export default function HeaderNav({
  categories,
}: {
  categories: CategoryLink[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close the phone menu and search whenever navigation lands on a new page.
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // "/" opens search from anywhere, unless the visitor is already typing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setOpen(false);
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    ...categories.map((c) => ({
      href: `/category/${c.slug}`,
      label: c.name,
      count: c.count,
    })),
  ];

  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <header>
      <div className="nav">
        <Link href="/" className="logo">
          XMSD <span>Professional</span>
        </Link>

        <nav className="nav-links" aria-label="Categories">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current(link.href)}
              className={current(link.href) ? "is-active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="nav-search"
            aria-label="Search products"
            aria-expanded={searchOpen}
            title="Search (press /)"
            onClick={() => {
              setOpen(false);
              setSearchOpen((v) => !v);
            }}
          >
            <SearchIcon className="icon-btn" />
          </button>
          <Link href="/products" className="btn btn-solid nav-cta">
            Shop now
          </Link>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setSearchOpen(false);
              setOpen((v) => !v);
            }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {searchOpen && <HeaderSearch onClose={() => setSearchOpen(false)} />}

      <nav
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Categories"
        hidden={!open}
      >
        <span className="section-tag">Shop by category</span>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current(link.href)}
            className={current(link.href) ? "is-active" : undefined}
          >
            <span>{link.label}</span>
            {link.count !== undefined && (
              <span className="num">{link.count}</span>
            )}
          </Link>
        ))}
        <Link href="/#story" className="mobile-menu-minor">
          About XMSD
        </Link>
        <Link href="/products" className="btn btn-solid">
          Shop the range
          <ArrowIcon className="btn-arrow" />
        </Link>
      </nav>
    </header>
  );
}

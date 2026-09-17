import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section wrap" style={{ textAlign: 'center' }}>
      <span className="section-tag">404</span>
      <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', margin: '0 auto 16px' }}>
        That tool isn&apos;t on the bench.
      </h2>
      <p style={{ color: 'var(--ink-mute)', maxWidth: '46ch', margin: '0 auto 32px' }}>
        The page you were after has moved or never existed. The full XMSD range is one click away.
      </p>
      <Link href="/products" className="btn btn-solid">
        Browse all products
      </Link>
    </section>
  );
}

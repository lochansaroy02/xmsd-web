import Link from 'next/link';
import { ArrowIcon, InstagramIcon, TwitterIcon, FacebookIcon } from './icons';
import { getBrandCategories } from '@/lib/categories';

export default async function Footer() {
  const categories = await getBrandCategories();

  return (
    <footer id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link href="/" className="logo">
              MSD <span>Professional</span>
            </Link>
            <p>Precision tools for hair, nail, and foot care — built for stations that don&apos;t get a slow day.</p>
            <div className="foot-social">
              <a href="#" aria-label="MSD on Instagram">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="MSD on X">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="MSD on Facebook">
                <FacebookIcon />
              </a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Shop</h5>
            <Link href="/products">All products</Link>
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                {category.name}
              </Link>
            ))}
          </div>
          <div className="foot-col">
            <h5>Company</h5>
            <Link href="/#story">Our story</Link>
            <a href="#">Trade &amp; wholesale</a>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Contact</a>
          </div>
          <div className="foot-col" style={{ maxWidth: 300 }}>
            <h5>Stay stocked</h5>
            <span className="foot-note">New tools and restock alerts, once or twice a month.</span>
            <form className="foot-form" action="#">
              <input type="email" placeholder="Enter your email" aria-label="Email address" />
              <button type="submit" aria-label="Subscribe">
                <ArrowIcon />
              </button>
            </form>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} MSD Professional. All rights reserved.</span>
          <span>Privacy policy · Terms &amp; conditions</span>
        </div>
      </div>
    </footer>
  );
}

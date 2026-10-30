import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from './icons';
import { clipDetail } from '@/lib/images';

export default function FeatureBanner() {
  return (
    <section className="wrap">
      <div className="feature">
        <div className="feature-copy">
          <span className="section-tag">Behind the tools</span>
          <h2>Made for the tenth client of the day, not just the first.</h2>
          <p>
            Chairs and benches don&apos;t slow down after lunch. Every MSD clip, brush, and blade is tested for grip
            strength and finish after repeated use — so it performs the same on client one and client twelve.
          </p>
          <div className="feature-cta">
            <Link href="/products" className="btn btn-solid">
              See the full range
              <ArrowIcon className="btn-arrow" />
            </Link>
            <Link href="#story" className="btn btn-outline">
              Our story
            </Link>
          </div>
          <div className="feature-stats">
            <div>
              <b>18K+</b>
              <span>Clips shipped</span>
            </div>
            <div>
              <b>92%</b>
              <span>Reorder rate</span>
            </div>
            <div>
              <b>7</b>
              <span>Product lines</span>
            </div>
          </div>
        </div>
        <div className="feature-img">
          <Image src={clipDetail} alt="Close detail of an MSD sectioning clip" sizes="(max-width: 880px) 90vw, 45vw" />
        </div>
      </div>
    </section>
  );
}

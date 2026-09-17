import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from './icons';
import { clipsViolet, manicureSet, nailCarePen, paddleBrushRed } from '@/lib/images';

type HeroProps = {
  /** Live count of tools in the MSD catalogue. */
  productCount: number;
};

export default function Hero({ productCount }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-kicker">Salon-grade tools, engineered for precision</div>
        <h1>Instruments for exacting hands.</h1>
        <p className="hero-sub">
          XMSD builds the sectioning clips, brushes, and nail &amp; foot-care instruments that stylists and
          technicians reach for on a full-booked day — durable, exact, and made to be used hundreds of times a
          week.
        </p>
        <div className="hero-cta">
          <Link href="/products" className="btn btn-solid">
            Shop the range
            <ArrowIcon className="btn-arrow" />
          </Link>
          <Link href="#categories" className="btn btn-outline">
            Browse by category
          </Link>
        </div>
        <div className="hero-stats">
          <div>
            <b>320+</b>
            <span>Salons stocking XMSD</span>
          </div>
          <div>
            <b>{productCount || 20}</b>
            <span>Tools in the current lineup</span>
          </div>
          <div>
            <b>4.8/5</b>
            <span>Average technician rating</span>
          </div>
        </div>
      </div>
      <div className="hero-art">
        <div className="plate p1" />
        <Image className="prod-1" src={clipsViolet} alt="XMSD sectioning clips in violet" priority sizes="(max-width: 880px) 45vw, 280px" />
        <Image className="prod-2" src={paddleBrushRed} alt="XMSD red paddle brush" priority sizes="(max-width: 880px) 34vw, 210px" />
        <Image className="prod-3" src={manicureSet} alt="XMSD manicure set" sizes="(max-width: 880px) 40vw, 250px" />
        <Image className="prod-4" src={nailCarePen} alt="XMSD nail care pen" sizes="(max-width: 880px) 30vw, 190px" />
        <div className="tag">
          <span className="tag-dot" /> Restocked this week
        </div>
      </div>
    </section>
  );
}

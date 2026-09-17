import Image from 'next/image';
import Link from 'next/link';
import { ArrowIcon } from './icons';
import {
  clipsSet,
  paddleBrushPink,
  tintBrush,
  razorComb,
  manicureSet,
  footFile,
  nailCarePen,
  spatulaSticks,
} from '@/lib/images';

const hair = [
  { src: clipsSet, alt: 'Sectioning clips' },
  { src: paddleBrushPink, alt: 'Pink paddle brush' },
  { src: tintBrush, alt: 'Tint brush' },
  { src: razorComb, alt: 'Razor comb' },
];

const nail = [
  { src: manicureSet, alt: 'Manicure set' },
  { src: footFile, alt: 'Foot file' },
  { src: nailCarePen, alt: 'Nail care pen' },
  { src: spatulaSticks, alt: 'Spatula sticks' },
];

export default function Lines() {
  return (
    <section className="wrap" id="nail">
      <div className="lines">
        <div className="line-block hair">
          <h3>The hair line</h3>
          <p>
            Sectioning, detangling, and texturising tools built around the pace of a real chair — colour-coded so a
            station never loses a clip mid-service.
          </p>
          <div className="line-items">
            {hair.map((item) => (
              <Image key={item.alt} src={item.src} alt={item.alt} width={88} height={88} sizes="88px" />
            ))}
          </div>
          <Link href="/category/hair-tools" className="btn btn-outline">
            Shop hair tools
            <ArrowIcon className="btn-arrow" />
          </Link>
        </div>
        <div className="line-block nail">
          <h3>Nail &amp; foot care</h3>
          <p>
            From cuticle work to the final buff — kits and single tools that go from the salon bench straight into a
            client&apos;s bag.
          </p>
          <div className="line-items">
            {nail.map((item) => (
              <Image key={item.alt} src={item.src} alt={item.alt} width={88} height={88} sizes="88px" />
            ))}
          </div>
          <Link href="/category/manicure-tools" className="btn btn-outline">
            Shop nail &amp; foot care
            <ArrowIcon className="btn-arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}

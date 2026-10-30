import Image from 'next/image';
import Link from 'next/link';
import { CheckIcon, PlayIcon } from './icons';
import { paddleBrushLineup } from '@/lib/images';

const points = [
  'Designed with working stylists and nail technicians, not just in a studio.',
  'Materials chosen for grip and heat resistance, not just looks.',
  "Every batch checked against a shop's actual daily volume, not a showroom shelf.",
];

export default function Story() {
  return (
    <section className="section wrap" id="story">
      <div className="story">
        <div className="story-media">
          <Image src={paddleBrushLineup} alt="MSD paddle brush lineup" sizes="(max-width: 880px) 90vw, 45vw" />
          <button className="play" type="button" aria-label="Play the MSD workshop film">
            <PlayIcon />
          </button>
        </div>
        <div className="story-copy">
          <span className="section-tag">Our story</span>
          <h2>Tools first, brand second.</h2>
          <p className="lead">
            MSD started with a single request from a barber shop that kept snapping cheap clips mid-shift: build one
            that survives a full week of colour, cut, and blow-dry stations. Every product since has been judged the
            same way — by whether a professional would trust it on a paying client.
          </p>
          <ul className="story-list">
            {points.map((point) => (
              <li key={point}>
                <CheckIcon />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link href="#footer" className="btn btn-solid" style={{ marginTop: 34 }}>
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}

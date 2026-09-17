import Image from 'next/image';
import { nailCarePen } from '@/lib/images';

const steps = [
  { title: 'Buff', note: 'Smooth ridges and refine the nail surface before shaping.' },
  { title: 'Polish', note: 'Bring up natural shine without a topcoat.' },
  { title: 'Detail tip', note: 'Get into corners and cuticle lines for precise touch-ups.' },
];

export default function Process() {
  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <span className="section-tag">How it&apos;s used</span>
          <h2>One pen, a full finish.</h2>
        </div>
        <p>The 4-in-1 Nail Care Pen swaps heads for each stage of the finish — no second tool required.</p>
      </div>
      <div className="process">
        <div className="process-img">
          <Image src={nailCarePen} alt="4-in-1 nail care pen heads" sizes="(max-width: 880px) 70vw, 35vw" />
        </div>
        <ol className="steps">
          {steps.map((step) => (
            <li key={step.title}>
              <div>
                <h4>{step.title}</h4>
                <p>{step.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

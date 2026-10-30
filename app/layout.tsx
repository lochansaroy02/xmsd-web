import Footer from '@/components/Footer';
import Header from '@/components/Header';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MSD Professional — Instruments for Exacting Hands',
    template: '%s — MSD Professional',
  },
  description:
    'MSD builds the sectioning clips, brushes, and nail & foot-care instruments that stylists and technicians reach for on a full-booked day.',
  openGraph: {
    title: 'MSD Professional — Instruments for Exacting Hands',
    description:
      'Salon-grade tools for hair, nail, and foot care — durable, exact, and made to be used hundreds of times a week.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body>
        <Header />
        <main>{children}</main>
        {/* <ServiceStrip /> */}
        <Footer />
      </body>
    </html>
  );
}

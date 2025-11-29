import Approach from '@/components/approach/Approach';
import Contact from '@/components/contact/Contact';
import Footer from '@/components/footer/Footer';
import Navigation from '@/components/header/Navigation';
import Hero from '@/components/hero/Hero';
import Heronew from '@/components/hero/Hero.new';
import Trusted from '@/components/hero/Trusted';
import Services from '@/components/home/Services';
import Process from '@/components/process/Process';
import Projects from '@/components/projects/Projects';
import Reviews from '@/components/reviews/Reviews';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XLAB – Home',
  description:
    'XLAB builds high-converting websites for SaaS, Startups, Agencies, and Digital Creators with modern UI/UX and Next.js development.',
  keywords: [
    'web design agency',
    'next.js developer',
    'saas website design',
    'ui ux design',
    'startup website',
    'landing page design',
    'digital agency',
  ],
  openGraph: {
    title: 'XLAB – Home',
    description:
      'XLAB builds high-converting websites for SaaS, Startups, Agencies, and Digital Creators with modern UI/UX and Next.js development.',
    url: 'https://xlab.vc',
    siteName: 'XLAB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XLAB – Home',
    description:
      'XLAB builds high-converting websites for SaaS, Startups, Agencies, and Digital Creators with modern UI/UX and Next.js development.',
  },
  alternates: {
    canonical: 'https://xlab.vc',
  },
};

export default function Home() {
  return (
    <main className='min-h-screen '>
      <Heronew />
      {/* <Navigation /> */}
      {/* <Hero /> */}
      {/* <Trusted /> */}
      {/* <Projects /> */}
      {/* <Process /> */}
      {/* <Approach /> */}
      {/* <Contact /> */}
      {/* <Footer /> */}
    </main>
  );
}

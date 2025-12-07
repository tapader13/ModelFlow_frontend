import Quote from '@/components/quote/Quote';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a 15 min Call',
  description:
    'Schedule a 15-minute consultation with ModelFlow to discuss your project. High-converting web design and development solutions for SaaS, startups, and agencies.',
  keywords: [
    'ModelFlow booking',
    'schedule call ModelFlow',
    'web design consultation',
    'SaaS website consultation',
    'startup website consultation',
  ],
  openGraph: {
    title: 'ModelFlow – Book a 15 min Call',
    description:
      'Schedule a 15-minute consultation with ModelFlow to discuss your project. High-converting web design and development solutions for SaaS, startups, and agencies.',
    url: 'https://ModelFlow.vc/quote',
    siteName: 'ModelFlow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ModelFlow – Book a 15 min Call',
    description:
      'Schedule a 15-minute consultation with ModelFlow to discuss your project. High-converting web design and development solutions for SaaS, startups, and agencies.',
  },
  alternates: {
    canonical: 'https://ModelFlow.vc/quote',
  },
};
const page = () => {
  return <Quote />;
};

export default page;

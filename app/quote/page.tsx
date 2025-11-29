import Quote from '@/components/quote/Quote';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a 15 min Call',
  description:
    'Schedule a 15-minute consultation with XLAB to discuss your project. High-converting web design and development solutions for SaaS, startups, and agencies.',
  keywords: [
    'XLAB booking',
    'schedule call XLAB',
    'web design consultation',
    'SaaS website consultation',
    'startup website consultation',
  ],
  openGraph: {
    title: 'XLAB – Book a 15 min Call',
    description:
      'Schedule a 15-minute consultation with XLAB to discuss your project. High-converting web design and development solutions for SaaS, startups, and agencies.',
    url: 'https://xlab.vc/quote',
    siteName: 'XLAB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XLAB – Book a 15 min Call',
    description:
      'Schedule a 15-minute consultation with XLAB to discuss your project. High-converting web design and development solutions for SaaS, startups, and agencies.',
  },
  alternates: {
    canonical: 'https://xlab.vc/quote',
  },
};
const page = () => {
  return <Quote />;
};

export default page;

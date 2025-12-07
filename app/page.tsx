import Heronew from '@/components/hero/Hero.new';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ModelFlow – ML Prediction Platform',
  description:
    'ModelFlow is a full-stack machine learning platform offering multiple ML models, real-time predictions, and an interactive web interface built with Next.js.',
  keywords: [
    'machine learning platform',
    'ml prediction app',
    'full stack ml project',
    'next.js machine learning',
    'ai prediction website',
    'ml api backend',
    'data science models',
    'fastapi machine learning',
  ],
  openGraph: {
    title: 'ModelFlow – ML Prediction Platform',
    description:
      'ModelFlow is a full-stack ML system providing multiple machine learning models with a modern Next.js frontend and FastAPI backend.',
    url: 'https://modelflow.app',
    siteName: 'ModelFlow',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ModelFlow – ML Prediction Platform',
    description:
      'ModelFlow is a full-stack machine learning platform built with Next.js and FastAPI, offering real-time predictions via multiple ML models.',
  },
  alternates: {
    canonical: 'https://modelflow.app',
  },
};

export default function Home() {
  return (
    <main className='min-h-screen '>
      <Heronew />
    </main>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono, Poppins, Sora } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Preloader from '@/components/Preloader';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sora',
});

export const metadata: Metadata = {
  title: {
    default: 'ModelFlow',
    template: 'ModelFlow – %s',
  },
  description:
    'We create websites that fulfill business goals with high-converting web design for SaaS, startups, agencies, and digital creators.',
  metadataBase: new URL('https://ModelFlow.vc'),

  openGraph: {
    type: 'website',
    url: 'https://ModelFlow.vc',
    title: 'ModelFlow – High-Converting Web Design Agency',
    description:
      'We create websites that fulfill business goals with high-converting design solutions for SaaS, startups, and digital creators.',
    siteName: 'ModelFlow',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ModelFlow – High-Converting Web Design Agency',
    description:
      'We create high-converting websites for SaaS, startups, agencies, and digital creators.',
  },

  alternates: {
    canonical: 'https://ModelFlow.vc',
  },
  icons: {
    icon: '/WhatsApp Image 2025-12-07 at 22.36.46_280ec6f8.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${sora.className} antialiased`}>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ModelFlow',
              url: 'https://ModelFlow.vc',
              logo: 'https://ModelFlow.vc/logo.png',
              description:
                'We build high-converting websites using Next.js and modern design systems.',
              sameAs: [
                'https://www.linkedin.com/company/ModelFlow',
                'https://twitter.com/ModelFlow',
              ],
            }),
          }}
        />

        {/* <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        > */}
        {/* <Preloader /> */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}

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
    default: 'XLAB',
    template: 'XLAB – %s',
  },
  description:
    'We create websites that fulfill business goals with high-converting web design for SaaS, startups, agencies, and digital creators.',
  metadataBase: new URL('https://xlab.vc'),

  openGraph: {
    type: 'website',
    url: 'https://xlab.vc',
    title: 'XLAB – High-Converting Web Design Agency',
    description:
      'We create websites that fulfill business goals with high-converting design solutions for SaaS, startups, and digital creators.',
    siteName: 'XLAB',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'XLAB – High-Converting Web Design Agency',
    description:
      'We create high-converting websites for SaaS, startups, agencies, and digital creators.',
  },

  alternates: {
    canonical: 'https://xlab.vc',
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
              name: 'XLAB',
              url: 'https://xlab.vc',
              logo: 'https://xlab.vc/logo.png',
              description:
                'We build high-converting websites using Next.js and modern design systems.',
              sameAs: [
                'https://www.linkedin.com/company/XLAB',
                'https://twitter.com/XLAB',
              ],
            }),
          }}
        />

        <ThemeProvider
          attribute='class'
          defaultTheme='Dark'
          enableSystem
          disableTransitionOnChange
        >
          {/* <Preloader /> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

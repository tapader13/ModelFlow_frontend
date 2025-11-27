'use client';
import Footer from '@/components/footer/Footer';
import Navigation from '@/components/header/Navigation';
import React from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
const page = () => {
  const theme = useTheme();
  //   console.log(theme);
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '15min' });
      cal('ui', {
        theme: theme.theme === 'dark' ? 'dark' : 'light',
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);
  return (
    <div>
      <Navigation />
      <div className='min-h-[80vh] py-24 flex justify-center items-center px-4'>
        <Cal
          namespace='15min'
          calLink='minhaj-tapader-brj7q9/15min'
          style={{ width: '100%', height: '100%', overflow: 'scroll' }}
          config={{
            layout: 'month_view',
            theme: theme.theme === 'dark' ? 'dark' : 'light',
          }}
        />
        ;
      </div>
      <Footer />
    </div>
  );
};

export default page;

'use client';
import Footer from '@/components/footer/Footer';
import Navigation from '@/components/header/Navigation';
import React from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import { Metadata } from 'next';

const Quote = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  const theme = 'light';
  //   console.log(theme);
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '15min' });
      cal('ui', {
        theme: theme,
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);
  return (
    <main className=' w-full min-h-screen bg-[#f9f9f9] relative  p-0'>
      <section className=' w-full min-h-screen lg:h-screen   p-3 relative overflow-hidden'>
        <section className='shadow-[0_8px_4px_#00000014,0_2px_4px_#0000001a] w-full relative h-full grid lg:grid-cols-6 grid-cols-1'>
          <div className='col-span-1  overflow-hidden bg-white border-r border-dashed border-gray-400 hidden lg:flex flex-col gap-4 relative'>
            <p className='text-[12px] mt-12 font-mono font-medium tracking-tight text-center text-black/40'>
              XLAB
            </p>

            <div className=' bg-transparent -translate-y-1/2 absolute top-1/2 -left-[210px] -right-6 h-[445px]  '>
              {/* VIDEO FULL, NO CROPPING */}
              <video
                src='/0i8gQ6qDnNdCU4Rf5tRecqYi64A.mp4'
                autoPlay
                loop
                muted
                playsInline
                preload='auto'
                className='w-full h-full  border-none outline-none object-cover object-center'
              />
            </div>
          </div>
          <div className='flex lg:hidden h-60 justify-between'>
            <div className=' overflow-hidden w-full bg-white  border-gray-400 flex flex-col gap-4 relative'>
              <p className='text-[12px] z-10 mt-8 mb-2 text-center font-mono font-medium tracking-tight  text-black/40'>
                XLAB
              </p>

              <div className=' bg-transparent -translate-y-1/2 absolute top-1/2 -left-[210px] -right-6 h-[445px]  '>
                <video
                  src='/0i8gQ6qDnNdCU4Rf5tRecqYi64A.mp4'
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload='auto'
                  className='w-full h-full  border-none outline-none object-cover object-center'
                />
              </div>
            </div>
            <div className=' overflow-hidden w-full bg-white  border-gray-400 flex flex-col gap-4 relative'>
              <p className='text-[12px] z-10 mt-8 mb-2 font-mono font-medium tracking-tight text-center text-black/40'>
                {timeString}
              </p>

              <div className=' bg-transparent -translate-y-1/2 absolute top-1/2 -right-[210px] -left-6 h-[445px]  '>
                <video
                  src='/FsU7HaCWP7lS7TPY07jh2mCkb1o.mp4'
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload='auto'
                  className='w-full h-full  border-none outline-none object-cover object-center scale-x-[-1]'
                />
              </div>
            </div>
          </div>
          <div className='col-span-4 border-r lg:overflow-y-auto lg:h-screen bg-white border-dashed border-gray-400 scrollbar-none '>
            <div>
              <div className='p-4'>
                {/* Back Arrow */}
                <Link
                  href='/'
                  className='flex items-center text-black hover:text-blue-800 mb-6'
                >
                  <HiArrowLeft className='mr-2 w-6 h-6' />
                  {/* Back */}
                </Link>

                {/* Heading */}
                <h1 className='text-center mt-10 text-blue-600 text-3xl font-bold'>
                  Book a 15 min call. <br />
                  <span className='text-black'>And we'll reach out.</span>
                </h1>
              </div>
              <div className=' bg-white h-full py-24 flex justify-center items-center px-4'>
                <Cal
                  namespace='15min'
                  calLink='minhaj-tapader-brj7q9/15min'
                  className='!scrollbar-none'
                  style={{ width: '100%', height: '100%' }}
                  config={{
                    layout: 'month_view',
                    theme: theme,
                  }}
                />
                ;
              </div>
            </div>
          </div>

          <div className='col-span-1  overflow-hidden bg-white border-r border-dashed border-gray-400 hidden lg:flex flex-col gap-4 relative'>
            <p className='text-[12px] mt-12 font-mono font-medium tracking-tight text-center text-black/40'>
              {timeString}
            </p>

            <div className=' bg-transparent -translate-y-1/2 absolute top-1/2 -right-[210px] -left-6 h-[445px]  '>
              {/* VIDEO FULL, NO CROPPING */}
              <video
                src='/FsU7HaCWP7lS7TPY07jh2mCkb1o.mp4'
                autoPlay
                loop
                muted
                playsInline
                preload='auto'
                className='w-full h-full  border-none outline-none object-cover object-center scale-x-[-1]'
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Quote;

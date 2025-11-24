import Footer from '@/components/footer/Footer';
import Navigation from '@/components/header/Navigation';
import Image from 'next/image';
import React from 'react';

const page = () => {
  return (
    <div>
      <Navigation />
      <div
        id='newsletter'
        className='relative py-18 lg:py-20 xl:py-28 overflow-hidden'
      >
        <div className='container md:pb-10'>
          <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center'>
            <div className='tagline ml-4 md:ml-0 flex items-center mb-4 md:justify-center'>
              <svg
                width='5'
                height='14'
                viewBox='0 0 5 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M5 0.822266H1V12.8223H5'
                  stroke='url(#brackets-left)'
                />
                <defs>
                  <linearGradient
                    id='brackets-left'
                    x1='50%'
                    x2='50%'
                    y1='0%'
                    y2='100%'
                  >
                    <stop offset='0%' stopColor='#89F9E8' />
                    <stop offset='100%' stopColor='#FACB7B' />
                  </linearGradient>
                </defs>
              </svg>
              <div className='mx-3 text-[#ada8c3]'>Stay Connected</div>
              <svg
                width='5'
                height='14'
                viewBox='0 0 5 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M0 0.822266H4V12.8223H0'
                  stroke='url(#brackets-right)'
                />
                <defs>
                  <linearGradient
                    id='brackets-right'
                    x1='14.635%'
                    x2='14.635%'
                    y1='0%'
                    y2='100%'
                  >
                    <stop offset='0%' stopColor='#9099FC' />
                    <stop offset='100%' stopColor='#D87CEE' />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h2 className='text-5xl ml-4 md:ml-0 font-semibold'>
              Our Newsletter
            </h2>
            <p className='text-[16px] ml-4 md:ml-0 mt-4 text-[#757185]'>
              Get the latest AI insights, project updates, and industry trends
              delivered to your inbox
            </p>
          </div>

          {/* Coming Soon Card */}
          <div className='text-center py-20'>
            <div className='relative max-w-[30rem] mx-auto'>
              <div className='relative bg-n-8 border border-n-1/10 rounded-3xl p-12'>
                <div className='absolute top-0 left-0 max-w-full opacity-50'>
                  <Image
                    className='w-full'
                    src='/projects/grid.png'
                    alt='Grid'
                    width={550}
                    height={550}
                  />
                </div>
                <div className='relative z-10'>
                  <h3 className='text-4xl font-medium mb-4'>Coming Soon</h3>
                  <p className='text-[16px] text-[#757185] mb-6'>
                    We're preparing something special for our newsletter
                    subscribers. Stay tuned for exclusive content, early access
                    to new features, and insider updates from our team.
                  </p>
                  <a
                    className=' relative uppercase font-semibold inline-flex items-center justify-center h-11 transition-colors hover:text-purple-600 text-xs px-7 text-white'
                    href='/contact'
                  >
                    <span className='relative z-10'>
                      Get notified when we launch
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Background Gradient */}
          <div className='absolute top-[18.25rem] -left-[30.375rem] w-[56.625rem] opacity-60 mix-blend-color-dodge pointer-events-none'>
            <div className='absolute top-1/2 left-1/2 w-[58.85rem] h-[58.85rem] -translate-x-3/4 -translate-y-1/2'>
              <Image
                className='w-full'
                src='/projects/gradient.png'
                alt='Gradient'
                width={942}
                height={942}
              />
            </div>
          </div>

          {/* Early Access CTA */}
          <div className='text-center mt-12'>
            <p className='text-xl text-[#757185] mb-6'>
              Want to be the first to know when our newsletter launches?
            </p>
            <a
              className=' relative inline-flex items-center justify-center h-11 transition-colors hover:text-purple-600 px-7 text-white font-semibold'
              href='/contact'
            >
              <span className='relative z-10'>Contact us for early access</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default page;

'use client';
import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import Trusted from './Trusted';
import { usePathname } from 'next/navigation';

const Heronew = () => {
  const pathname = usePathname();
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  const fixedSides = pathname === '/' || pathname === '/quote';
  return (
    <main className=' w-full min-h-screen bg-[#f9f9f9] relative  p-0'>
      <section className=' w-full min-h-screen lg:h-screen   p-3 relative overflow-hidden'>
        <section className='shadow-[0_8px_4px_#00000014,0_2px_4px_#0000001a] w-full hidden  relative h-full lg:grid grid-cols-6'>
          <div className='col-span-1  overflow-hidden bg-white border-r border-dashed border-gray-400 flex flex-col gap-4 relative'>
            <p className='text-[12px] mt-12 font-mono font-medium tracking-tight text-center text-black/40'>
              ModelFlow
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

          <div className='col-span-4 bg-white border-r border-dashed border-gray-400'>
            {/* <div className='absolute inset-0'>
              <Image
                src='https://framerusercontent.com/images/hJjm69hVpcjIeFcGBIChyPyKLs.png?width=2119&height=540'
                alt='Hero background'
                fill
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div> */}

            {/* Content */}
            <div className='relative z-10 flex flex-col items-center justify-center h-full text-center'>
              <h1 className='text-5xl mb-10 font-bold bg-linear-to-r from-black via-black to-blue-500 bg-clip-text text-transparent'>
                ModelFlow
              </h1>
              <h1 className='text-4xl font-medium bg-linear-to-r from-black via-black to-blue-500 bg-clip-text text-transparent'>
                Full-Stack ML Platform <br /> for Intelligent Predictions
              </h1>
              <p className='mt-4 text-gray-600'>
                Deploy multiple machine learning models, make real-time
                predictions, <br />
                and manage everything from one powerful dashboard
              </p>

              {/* Buttons */}
              <div className='mt-6 flex gap-4'>
                {/* <Button
                  asChild
                  className='hover:bg-black hover:text-white'
                  variant='default'
                >
                  <Link href='/case-study'>See portfolio</Link>
                </Button> */}
                <a
                  href='/case-study'
                  className='
    group relative inline-flex items-center justify-center 
    h-12 px-8 
    bg-white border border-gray-300 
    rounded-md 
    font-medium text-gray-700 
    overflow-hidden
    transition-all duration-300 ease-out
    hover:bg-black hover:border-black hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
  '
                >
                  {/* Text moving up */}
                  <span className='transition-transform duration-300 ease-out group-hover:-translate-y-[120%]'>
                    See dashboard
                  </span>

                  {/* Text sliding in */}
                  <span className='absolute transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0 text-white'>
                    See dashboard
                  </span>
                </a>
                <a
                  href='/quote'
                  className='
    group relative inline-flex items-center justify-center 
    h-12 px-8 
    bg-black border border-gray-300 
    rounded-md 
    font-medium text-white 
    overflow-hidden
    transition-all duration-300 ease-out
    hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  '
                >
                  {/* Text moving up */}
                  <span className='transition-transform duration-300 ease-out group-hover:-translate-y-[120%]'>
                    Book a call
                  </span>

                  {/* Text sliding in */}
                  <span className='absolute transition-transform duration-300 ease-out translate-y-[130%] group-hover:translate-y-0 text-white'>
                    Book a call
                  </span>
                </a>

                {/* <Button
                  asChild
                  className='hover:bg-blue-700 hover:text-white'
                  variant='secondary'
                >
                  <Link href='/quote'>Book a call</Link>
                </Button> */}
              </div>
              {/* Clients Logos */}
              <Trusted />
            </div>

            {/* <div className='absolute bottom-4 w-full flex justify-center gap-8 opacity-50'> */}
            {/* <Image
                src='https://framerusercontent.com/images/RN5CsxOad8pTUyCWgfbuaKBVWqA.png?width=601&height=187'
                alt='Client logo'
                width={150}
                height={50}
              /> */}
            {/* Add more logos similarly */}
            {/* </div> */}
          </div>

          <div className='col-span-1  overflow-hidden bg-white border-r border-dashed border-gray-400 flex flex-col gap-4 relative'>
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
        <section className='shadow-[0_8px_4px_#00000014,0_2px_4px_#0000001a] w-full   relative h-full lg:hidden'>
          <div className='flex h-60 justify-between'>
            <div className=' overflow-hidden w-full bg-white  border-gray-400 flex flex-col gap-4 relative'>
              <p className='text-[12px] z-10 mt-8 mb-2 text-center font-mono font-medium tracking-tight  text-black/40'>
                ModelFlow
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
            <div className=' overflow-hidden w-full bg-white  border-gray-400 flex flex-col gap-4 relative'>
              <p className='text-[12px] z-10 mt-8 mb-2 font-mono font-medium tracking-tight text-center text-black/40'>
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
          </div>

          <div className='w-full py-12 bg-white  border-gray-400'>
            {/* <div className='absolute inset-0'>
              <Image
                src='https://framerusercontent.com/images/hJjm69hVpcjIeFcGBIChyPyKLs.png?width=2119&height=540'
                alt='Hero background'
                fill
                style={{ objectFit: 'contain', objectPosition: 'center' }}
              />
            </div> */}

            {/* Content */}
            <div className='relative z-10 flex flex-col items-center justify-center h-full text-center'>
              <h1 className='text-4xl mb-10 font-bold bg-linear-to-r from-black via-black to-blue-500 bg-clip-text text-transparent'>
                ModelFlow
              </h1>
              <h1 className='text-3xl font-medium bg-linear-to-r from-black via-black to-blue-500 bg-clip-text text-transparent'>
                Premium Design Studio <br /> for SaaS & Startups
              </h1>
              <p className='mt-4 text-gray-600'>
                Immersive websites, launch animations <br /> and effective
                branding.
              </p>

              {/* Buttons */}
              <div className='mt-6 flex gap-4'>
                {/* <Button
                  asChild
                  className='hover:bg-black hover:text-white'
                  variant='default'
                >
                  <Link href='/case-study'>See portfolio</Link>
                </Button> */}
                <a
                  href='/case-study'
                  className='
    group relative inline-flex items-center justify-center 
    h-12 px-8 
    bg-white border border-gray-300 
    rounded-md 
    font-medium text-gray-700 
    overflow-hidden
    transition-all duration-300 ease-out
    hover:bg-black hover:border-black hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
  '
                >
                  {/* Text moving up */}
                  <span className='transition-transform duration-300 ease-out group-hover:-translate-y-[120%]'>
                    See portfolio
                  </span>

                  {/* Text sliding in */}
                  <span className='absolute transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0 text-white'>
                    See portfolio
                  </span>
                </a>
                <a
                  href='/quote'
                  className='
    group relative inline-flex items-center justify-center 
    h-12 px-8 
    bg-black border border-gray-300 
    rounded-md 
    font-medium text-white 
    overflow-hidden
    transition-all duration-300 ease-out
    hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  '
                >
                  {/* Text moving up */}
                  <span className='transition-transform duration-300 ease-out group-hover:-translate-y-[120%]'>
                    Book a call
                  </span>

                  {/* Text sliding in */}
                  <span className='absolute transition-transform duration-300 ease-out translate-y-[130%] group-hover:translate-y-0 text-white'>
                    Book a call
                  </span>
                </a>

                {/* <Button
                  asChild
                  className='hover:bg-blue-700 hover:text-white'
                  variant='secondary'
                >
                  <Link href='/quote'>Book a call</Link>
                </Button> */}
              </div>
              {/* Clients Logos */}
              <Trusted />
            </div>

            {/* <div className='absolute bottom-4 w-full flex justify-center gap-8 opacity-50'> */}
            {/* <Image
                src='https://framerusercontent.com/images/RN5CsxOad8pTUyCWgfbuaKBVWqA.png?width=601&height=187'
                alt='Client logo'
                width={150}
                height={50}
              /> */}
            {/* Add more logos similarly */}
            {/* </div> */}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Heronew;

import Link from 'next/link';
import React from 'react';
import { data } from '../projects/[title]/data';
import { HiArrowLeft } from 'react-icons/hi';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Explore XLAB case studies: high-converting web design and development projects for SaaS, startups, and digital agencies.',
  keywords: [
    'XLAB case studies',
    'web design portfolio',
    'SaaS web design',
    'startup websites',
    'agency portfolio',
    'UI/UX design projects',
  ],
  openGraph: {
    title: 'XLAB – Case Studies',
    description:
      'Explore XLAB case studies: high-converting web design and development projects for SaaS, startups, and digital agencies.',
    url: 'https://xlab.vc/case-studies',
    siteName: 'XLAB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XLAB – Case Studies',
    description:
      'Explore XLAB case studies: high-converting web design and development projects for SaaS, startups, and digital agencies.',
  },
  alternates: {
    canonical: 'https://xlab.vc/case-studies',
  },
};

const page = () => {
  return (
    <main className='w-full min-h-screen bg-[#f9f9f9] relative p-0'>
      <section className='w-full min-h-screen p-3 relative overflow-hidden'>
        <section className='shadow-[0_8px_4px_#00000014,0_2px_4px_#0000001a] w-full relative h-full px-10 py-5'>
          <Link
            href='/'
            className='absolute cursor-pointer text-black hover:text-blue-800'
          >
            <HiArrowLeft className='mr-2 w-6 h-6' />
          </Link>

          <h1 className='lg:text-5xl text-3xl text-center mb-10 font-bold bg-linear-to-r from-black via-black to-blue-500 bg-clip-text text-transparent'>
            XLAB
          </h1>

          <section className='rounded-xl flex flex-col items-center space-y-10'>
            {/* Images Section */}
            <section className='relative items-center p-4 bg-[#f4f4f4] flex space-x-0'>
              <div className='flex'>
                <figure className='relative h-7 w-7 lg:w-11 z-20 lg:h-11 rounded-full shadow-lg overflow-hidden'>
                  <img
                    src='https://framerusercontent.com/images/f83c9nwlZghmsOqr5KiPD7NpS1I.png?width=281&height=281'
                    alt='people 1'
                    className='w-full h-full object-cover'
                  />
                </figure>
                <figure className='relative h-7 w-7 lg:w-11 z-10 lg:h-11 -left-3 rounded-full shadow-lg overflow-hidden bg-gradient-to-b from-blue-100 to-blue-300'>
                  <img
                    src='https://framerusercontent.com/images/E3taK89otlzdIR6McZAxomrQPyo.png?width=512&height=512'
                    alt='people 2'
                    className='w-full h-full object-cover rounded-full'
                  />
                </figure>
                <figure className='relative h-7 w-7 lg:w-11 z-0 lg:h-11 -left-6 rounded-full shadow-md overflow-hidden bg-gray-300'>
                  <img
                    src='https://framerusercontent.com/images/UaeMNaCCtVrxQXhyIzZB7ihAs.png?width=512&height=512'
                    alt='people 3'
                    className='w-full h-full object-cover'
                  />
                </figure>
              </div>

              <p className='text-center text-gray-500 text-sm lg:text-lg'>
                80+ startups & founders chose to Skale
              </p>
            </section>

            <h2 className='text-center text-gray-800 text-4xl lg:text-[6.875rem] font-bold'>
              Case Studies
            </h2>
          </section>

          <section className='max-w-7xl mx-auto flex flex-col mt-14 gap-10'>
            {data.slice(2, 9).map((project, idx) => (
              <Link
                key={idx}
                href={project.href}
                className='overflow-hidden transition-shadow duration-300 grid md:grid-cols-12 grid-cols-1'
              >
                <figure className='relative col-span-5 w-full h-[400px]'>
                  <img
                    src={`${project.img}?width=1174&height=848`}
                    alt={project.title}
                    className='w-full rounded-xl h-full object-cover'
                  />
                  <figcaption className='sr-only'>{project.title}</figcaption>
                </figure>

                <section className='p-6 space-y-4 col-span-7 flex flex-col justify-center'>
                  <header>
                    <h3 className='text-4xl font-bold text-gray-800'>
                      {project.title}
                    </h3>
                    <p className='text-gray-500 mt-2 text-xl'>
                      {project.description}
                    </p>
                  </header>

                  <section className='mt-5'>
                    <p className='font-semibold text-gray-800'>Duration</p>
                    <p className='text-gray-500'>4 months</p>
                  </section>
                  <section>
                    <p className='font-semibold text-gray-800'>Industry</p>
                    <p className='text-gray-500'>SaaS</p>
                  </section>
                </section>
              </Link>
            ))}
          </section>
        </section>
      </section>
    </main>
  );
};

export default page;

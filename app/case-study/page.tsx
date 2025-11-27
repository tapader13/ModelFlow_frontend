import Link from 'next/link';
import React from 'react';
import { data } from '../projects/[title]/data';
import { HiArrowLeft } from 'react-icons/hi';

const page = () => {
  return (
    <div className=' w-full min-h-screen bg-[#f9f9f9] relative  p-0'>
      <div className=' w-full min-h-screen   p-3 relative overflow-hidden'>
        <div className='shadow-[0_8px_4px_#00000014,0_2px_4px_#0000001a] w-full relative h-full px-10 py-5 '>
          <Link
            href='/'
            className=' absolute cursor-pointer text-black hover:text-blue-800'
          >
            <HiArrowLeft className='mr-2 w-6 h-6' />
          </Link>
          <h1 className='lg:text-5xl text-3xl text-center mb-10 font-bold bg-linear-to-r from-black via-black to-blue-500 bg-clip-text text-transparent'>
            XLAB
          </h1>

          <div className=' rounded-xl flex flex-col items-center space-y-10'>
            {/* Images Section */}
            <div className='relative items-center p-4 bg-[#f4f4f4] flex space-x-0'>
              <div className='flex'>
                {' '}
                {/* First Memoji */}
                <div className='relative h-7 w-7 lg:w-11 z-20 lg:h-11 rounded-full shadow-lg overflow-hidden'>
                  <img
                    src='https://framerusercontent.com/images/f83c9nwlZghmsOqr5KiPD7NpS1I.png?width=281&height=281'
                    alt='Memoji 1'
                    className='w-full h-full object-cover'
                  />
                </div>
                {/* Second Memoji with gradient background */}
                <div className='relative h-7 w-7 lg:w-11 z-10 lg:h-11 -left-3 rounded-full shadow-lg overflow-hidden bg-gradient-to-b from-blue-100 to-blue-300'>
                  <img
                    src='https://framerusercontent.com/images/E3taK89otlzdIR6McZAxomrQPyo.png?width=512&height=512'
                    alt='Memoji 2'
                    className='w-full h-full object-cover rounded-full'
                  />
                </div>
                {/* Third Memoji */}
                <div className='relative h-7 w-7 lg:w-11 z-0 lg:h-11 -left-6 rounded-full shadow-md overflow-hidden bg-gray-300'>
                  <img
                    src='https://framerusercontent.com/images/UaeMNaCCtVrxQXhyIzZB7ihAs.png?width=512&height=512'
                    alt='Memoji 3'
                    className='w-full h-full object-cover rounded-full'
                  />
                </div>
              </div>

              {/* Subtext */}
              <p className='text-center text-gray-500 text-sm lg:text-lg'>
                80+ startups & founders chose to Skale
              </p>
            </div>

            {/* Main Heading */}
            <h1 className='text-center text-gray-800 text-4xl lg:text-[6.875rem] font-bold'>
              Case Studies
            </h1>
          </div>

          <div className='max-w-7xl mx-auto flex flex-col mt-14 gap-10'>
            {data.slice(2, 9).map((project, idx) => (
              <Link
                href={project.href}
                className='  overflow-hidden  transition-shadow duration-300 grid md:grid-cols-12 grid-cols-1'
              >
                {/* Image */}
                <div className='relative col-span-5 w-full h-[400px]'>
                  <img
                    src={`${project.img}?width=1174&height=848`}
                    alt={project.title}
                    className='w-full rounded-xl h-full object-cover'
                  />
                </div>

                {/* Text Content */}
                <div className='p-6 space-y-4 col-span-7 flex flex-col justify-center'>
                  {/* Title & Subtitle */}
                  <div>
                    <h1 className='text-4xl font-bold text-gray-800'>
                      {project.title}
                    </h1>
                    <p className='text-gray-500 mt-2 text-xl'>
                      {project.description}
                    </p>
                  </div>

                  {/* Details: Duration & Industry */}

                  <div className='mt-5'>
                    <p className='font-semibold text-gray-800'>Duration</p>
                    <p className='text-gray-500'>4 months</p>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-800'>Industry</p>
                    <p className='text-gray-500'>SaaS</p>
                  </div>
                </div>
              </Link>
            ))}

            {/* <Link
              href='/case-study/framer'
              className='  overflow-hidden  transition-shadow duration-300 grid grid-cols-12'
            >
              <div className='relative col-span-5 w-full h-[400px]'>
                <img
                  src='https://framerusercontent.com/images/NOcy3Oh00URCbqAY4x3kSCPtB0.png?scale-down-to=1024&width=1174&height=848'
                  alt='Framer'
                  className='w-full rounded-xl h-full object-cover'
                />
              </div>

              <div className='p-6 space-y-4 col-span-7 flex flex-col justify-center'>
                <div>
                  <h1 className='text-4xl font-bold text-gray-800'>Framer</h1>
                  <p className='text-gray-500 text-xl'>
                    Worked on redesigning huge B2B companies with the Framer
                    team
                  </p>
                </div>


                <div className='mt-5'>
                  <p className='font-semibold text-gray-800'>Duration</p>
                  <p className='text-gray-500'>3 weeks</p>
                </div>
                <div>
                  <p className='font-semibold text-gray-800'>Industry</p>
                  <p className='text-gray-500'>SaaS</p>
                </div>
              </div>
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

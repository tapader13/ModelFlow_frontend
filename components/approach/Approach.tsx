import React from 'react';

const Approach = () => {
  return (
    <div className='overflow-x-hidden'>
      <div className='container mt-20 px-4'>
        {/* Section Header */}
        <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 text-center md:text-center'>
          <h2 className='text-4xl sm:text-5xl leading-tight font-bold'>
            End-to-end AI engineering & design
          </h2>
          <p className='mt-4 text-[#757585]'>
            From discovery to deployment — we build production AI products and
            integrations.
          </p>
        </div>

        {/* Main Card */}
        <div className='relative max-w-[1200px] mx-auto'>
          <div className='relative z-10 flex flex-col md:flex-row items-center h-[35rem] sm:h-[40rem] lg:h-[46rem] mb-5 p-6 sm:p-8 lg:p-20 border border-white/10 rounded-3xl overflow-hidden'>
            {/* LEFT IMAGE */}
            <div className='absolute top-0 left-0 w-full h-full md:w-3/5 xl:w-auto pointer-events-none'>
              <img
                className='w-full h-full object-cover md:object-right max-w-full max-h-full'
                src='/approach/service-1.png'
                alt='Smartest AI'
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className='relative z-10 max-w-[17rem] md:ml-auto mt-32 md:mt-0'>
              <h4 className='text-2xl font-semibold mb-4'>Our approach</h4>

              <p className='text-[#757185] mb-8 sm:mb-12'>
                We combine strategic insight, AI research, and agile engineering
                to deliver measurable impact.
              </p>

              <ul className='text-gray-300 space-y-4'>
                <li className='flex items-start border-t border-gray-700 pt-4'>
                  <img
                    className='bg-purple-600 h-6 w-6 rounded-full flex-shrink-0'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <p className='ml-4'>Product strategy & discovery</p>
                </li>

                <li className='flex items-start border-t border-gray-700 pt-4'>
                  <img
                    className='bg-purple-600 h-6 w-6 rounded-full flex-shrink-0'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <p className='ml-4'>Collaborative Solution Design</p>
                </li>

                <li className='flex items-start border-t border-gray-700 pt-4'>
                  <img
                    className='bg-purple-600 h-6 w-6 rounded-full flex-shrink-0'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <p className='ml-4'>Integration & deployment</p>
                </li>
              </ul>
            </div>
          </div>

          {/* BACKGROUND GRADIENT */}
          <div className='absolute top-0 -left-[10rem] w-[56rem] h-[45rem] md:h-[56rem] opacity-40 pointer-events-none z-0'>
            <img
              className='absolute top-1/2 left-1/2 w-full max-w-[80rem] h-full max-h-[90rem] -translate-x-1/2 -translate-y-1/2 blur-3xl object-cover'
              src='/approach/gradient.png'
              alt='Gradient'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Approach;

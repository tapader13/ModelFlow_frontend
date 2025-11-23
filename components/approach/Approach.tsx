import React from 'react';

const Approach = () => {
  return (
    <div>
      <div className='container mt-20'>
        {/* Section Header */}
        <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center'>
          <h2 className='text-5xl leading-14 font-bold'>
            End-to-end AI engineering & design
          </h2>
          <p className='mt-4 text-[#757585]'>
            From discovery to deployment — we build production AI products and
            integrations.
          </p>
        </div>

        {/* Main Card */}
        <div className='relative max-w-[1200px] mx-auto'>
          <div className='relative z-10 flex items-center h-[39rem] mb-5 p-8 border border-white/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]'>
            {/* LEFT IMAGE */}
            <div className='absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto'>
              <img
                className='w-full h-full object-cover md:object-right'
                src='/approach/service-1.png'
                alt='Smartest AI'
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className='relative z-10 max-w-[17rem] ml-auto'>
              <h4 className='text-2xl font-semibold mb-4'>Our approach</h4>

              <p className='text-[#757185] mb-12'>
                We combine strategic insight, AI research, and agile engineering
                to deliver measurable impact.
              </p>

              <ul className='text-gray-300'>
                <li className='flex items-start py-4 border-t border-gray-700'>
                  <img
                    className='bg-purple-600 h-6 w-6 rounded-full'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <p className='ml-4'>Product strategy & discovery</p>
                </li>

                <li className='flex items-start py-4 border-t border-gray-700'>
                  <img
                    className='bg-purple-600 rounded-full'
                    width='24'
                    height='24'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <p className='ml-4'>Collaborative Solution Design</p>
                </li>

                <li className='flex items-start py-4 border-t border-gray-700'>
                  <img
                    className='bg-purple-600 rounded-full'
                    width='24'
                    height='24'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <p className='ml-4'>Integration & deployment</p>
                </li>
              </ul>
            </div>
          </div>

          {/* BACKGROUND GRADIENT */}
          <div className='absolute top-0 -left-[10rem] w-[56rem] h-[56rem] opacity-40 pointer-events-none z-0'>
            <img
              className='absolute top-1/2 left-1/2 w-[80rem] h-[90rem] -translate-x-1/2 -translate-y-1/2 blur-3xl'
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

import React from 'react';

const Projects = () => {
  return (
    <div className='relative py-10 lg:py-16 xl:py-20 overflow-hidden'>
      <div className='max-w-[1200px] mx-auto px-4 md:pb-10'>
        <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center'>
          <div className='tagline flex items-center mb-4 md:justify-center'>
            {/* Left SVG */}
            <svg
              width='5'
              height='14'
              viewBox='0 0 5 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M5 0.822266H1V12.8223H5' stroke='url(#brackets-left)' />
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
            <div className='mx-3 text-gray-400'>Choose Your Project Type</div>
            {/* Right SVG */}
            <svg
              width='5'
              height='14'
              viewBox='0 0 5 14'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M0 0.822266H4V12.8223H0' stroke='url(#brackets-right)' />
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
          <h2 className='text-5xl text-center'>Our Project Categories</h2>
        </div>

        <div className='relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]'>
          {[
            {
              title: 'Fundamental Projects',
              href: '/projects/fundamental',
              img: '/projects/Fundamental.jpg',
              description:
                'Core AI solutions and foundational technology projects that form the backbone of digital transformation.',
              features: [
                'AI Model Development',
                'Machine Learning Solutions',
                'Data Analytics Platforms',
                'Core System Architecture',
              ],
            },
            {
              title: 'Incremental Projects',
              href: '/projects/incremental',
              img: '/projects/Incremental.jpeg',
              description:
                'SaaS applications and incremental improvements that build upon existing systems and drive continuous growth.',
              features: [
                'SaaS Applications',
                'Progressive Web Apps',
                'API Integrations',
                'Feature Enhancements',
              ],
            },
          ].map((project, idx) => (
            <a
              key={idx}
              href={project.href}
              className='block group cursor-pointer hover:scale-105 md:flex even:md:translate-y-[7rem] overflow-hidden hover:shadow-lg transition-all duration-300'
            >
              <div
                className='p-0.5 rounded-[2.5rem] bg-gradient-to-r 
            from-[rgba(172,106,255,0.2)] 
            via-[rgba(255,200,118,0.2)] 
            to-[rgba(255,119,111,0.2)] group-hover:from-[rgba(172,106,255,0.2)]/40 
            group-hover:via-[rgba(255,200,118,0.2)]/40 
            group-hover:to-[rgba(255,119,111,0.2)]/40group-hover:scale-105 transition-all duration-500'
              >
                <div className='relative bg-[#0e0c15] rounded-[2.375rem] overflow-hidden h-full group-hover:bg-[#15131D] transition-all duration-300'>
                  <div className='overflow-hidden rounded-t-[2.375rem] relative z-[1]'>
                    <img
                      className='w-full group-hover:scale-110 transition-transform duration-300'
                      width={400}
                      height={250}
                      alt={project.title}
                      src={project.img}
                    />
                  </div>
                  <div className='relative z-[1] p-6 xl:p-8'>
                    <div className='flex items-start justify-between'>
                      <div className=' flex items-center mb-4 md:justify-center'>
                        {/* Left SVG */}
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
                        <div className='mx-3 text-gray-400'>
                          {project.title}
                        </div>
                        {/* Right SVG */}
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
                      <div className='flex items-center px-3 py-1 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full text-black group-hover:shadow-lg group-hover:shadow-color-1/25 transition-all duration-300'>
                        <img
                          className='mr-2'
                          width='14'
                          height='14'
                          alt='Available'
                          src='/projects/check-02.svg'
                        />
                        <div className='text-xs font-semibold'>Available</div>
                      </div>
                    </div>
                    <h4 className=' text-2xl mb-3 text-white group-hover:text-purple-500 transition-colors duration-300'>
                      {project.title}
                    </h4>
                    <p className='text-[#757185] text-sm leading-relaxed group-hover:text-[#ada8c3] transition-colors duration-300 mb-4'>
                      {project.description}
                    </p>
                    <ul className='space-y-1'>
                      {project.features.map((feature, i) => (
                        <li
                          key={i}
                          className='text-xs text-[#757185] flex items-center group-hover:text-[#ada8c3] transition-colors duration-300'
                        >
                          <span className='w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mr-2' />{' '}
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;

'use client';

import React, { useEffect, useState } from 'react';

const Process = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const outerIcons = [
    { icon: '/process/figma.png', width: 26, height: 36, alt: 'Figma' },
    { icon: '/process/notion.png', width: 34, height: 36, alt: 'Notion' },
    { icon: '/process/discord.png', width: 36, height: 28, alt: 'Discord' },
    { icon: '/process/slack.png', width: 34, height: 35, alt: 'Slack' },
    { icon: '/process/photoshop.png', width: 34, height: 34, alt: 'Photoshop' },
    { icon: '/process/protopie.png', width: 34, height: 34, alt: 'Protopie' },
    { icon: '/process/framer.png', width: 26, height: 34, alt: 'Framer' },
    { icon: '/process/raindrop.png', width: 38, height: 32, alt: 'Raindrop' },
  ];

  return (
    <div className='relative py-10 lg:py-16 xl:py-20 overflow-hidden'>
      <div className='max-w-[1200px] mx-auto px-4 md:pb-10'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='max-w-100'>
            <h1 className='text-5xl leading-14 font-medium mb-4 md:mb-8'>
              Development Process & Collaboration
            </h1>
            <ul className='max-w-88 mb-10 md:mb-14'>
              <li className='mb-3 py-3'>
                <div className='flex items-center'>
                  <img
                    className='bg-purple-600 rounded-full'
                    width='24'
                    height='24'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <h6 className='text-[16px] ml-5'>
                    Product Strategy &amp; Discovery
                  </h6>
                </div>
                <p className='text-[16px] mt-3 text-[#757185]'>
                  We identify challenges, define goals, and create clear,
                  data-driven roadmaps.
                </p>
              </li>
              <li className='mb-3 py-3'>
                <div className='flex items-center'>
                  <img
                    className='bg-purple-600 rounded-full'
                    width='24'
                    height='24'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <h6 className='text-[16px] ml-5'>
                    Collaborative Solution Design
                  </h6>
                </div>
                <p className='text-[16px] mt-3 text-[#757185]'>
                  We co-create intelligent solutions through adaptability,
                  transparency, and continuous feedback.
                </p>
              </li>
              <li className='mb-3 py-3'>
                <div className='flex items-center'>
                  <img
                    className='bg-purple-600 rounded-full'
                    width='24'
                    height='24'
                    alt='check'
                    src='/projects/check-02.svg'
                  />
                  <h6 className='text-[16px] ml-5'>
                    Integration &amp; Deployment
                  </h6>
                </div>
                <p className='text-[16px] mt-3 text-[#757185]'>
                  We integrate, optimize, and support your AI solution for
                  lasting success.
                </p>
              </li>
            </ul>
          </div>
          <div className='lg:ml-auto lg:w-[580px] xl:w-152 mt-4'>
            <p className='text-[16px] mb-8 text-[#757185] md:mb-16 lg:mb-32 lg:w-88 lg:mx-auto'>
              We work closely with your team using modern development tools and
              agile methodologies to deliver exceptional results on time.
            </p>
            <div className='relative w-full flex justify-center'>
              <div className='relative flex w-[22rem] aspect-square border border-n-6 rounded-full scale-75 sm:scale-90 md:scale-100 lg:scale-110 xl:scale-100'>
                {/* <!-- Center Icon --> */}
                <div className='w-[6rem] aspect-square m-auto p-[0.2rem] rounded-full'>
                  <div className='flex border-2 border-t-[#ac6aff] border-b-[#ffc876] border-l-[#ff776f] border-r-pink-600 items-center justify-center w-full h-full bg-n-8 rounded-full'>
                    <img
                      width='48'
                      height='48'
                      alt='xlab brainwave symbol'
                      src='/process/brainwave-symbol.svg'
                    />
                  </div>
                </div>

                {/* <!-- Outer Icons with Infinite Circular Animation --> */}
                <ul
                  className='absolute inset-0 transition-transform duration-100 ease-linear'
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {outerIcons.map((item, index) => {
                    const baseRotation = (360 / outerIcons.length) * index;
                    const currentRotation =
                      (baseRotation - rotation + 360) % 360;

                    return (
                      <li
                        key={index}
                        className='absolute top-0 left-1/2 h-1/2 -ml-[1.6rem] origin-bottom'
                        style={{ transform: `rotate(${baseRotation}deg)` }}
                      >
                        <div
                          className='relative -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-[#15131d] border border-n-1/15 rounded-xl transition-transform duration-100 ease-linear'
                          style={{
                            transform: `rotate(${-currentRotation}deg)`,
                          }}
                        >
                          <img
                            className='m-auto transition-transform duration-100 ease-linear'
                            width={item.width}
                            height={item.height}
                            alt={item.alt}
                            src={item.icon}
                            style={{
                              transform: `rotate(${currentRotation}deg)`,
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;

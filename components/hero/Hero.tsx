import { Button } from '../ui/button';

export default function Hero() {
  return (
    <section
      id='home'
      className='relative pt-[4.75rem] pb-16 lg:pt-[5.25rem] lg:pb-24'
    >
      <div className='container relative'>
        {/* Hero Text */}
        <div className='relative z-10 max-w-[64rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]'>
          <h1
            className=' text-6xl mt-10 leading-[72px] font-semibold mb-6'
            style={{ opacity: 1, transform: 'none' }}
          >
            We Simplify Complexity, So You Can Focus on Growth –{' '}
            <span className='inline-block relative'>
              XLAB{' '}
              <img
                className='absolute top-full left-0 w-full xl:-mt-2'
                width={624}
                height={28}
                alt='Curve'
                src='/hero/curve.png'
              />
            </span>
          </h1>
          <p
            className='body-1 text-[#cac6dd] max-w-3xl mx-auto mb-6  text-xl lg:mb-8'
            style={{ opacity: 1, transform: 'none' }}
          >
            Unleash the power of AI with XLAB. We craft generative, adaptive AI
            solutions that make your product feel like magic.
          </p>

          <Button
            // variant='primary'
            // ='/contact'
            className='font-poppins cursor-pointer uppercase bg-transparent border-t-purple-700 border-b-pink-500 border-l-indigo-500 dark:text-white hover:bg-transparent border-r-orange-700 text-black border-2'
          >
            Book a schedule
          </Button>
        </div>

        {/* Hero Image / Overlay Cards */}
        <div className='relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24'>
          <div className='relative z-1 p-0.5 rounded-2xl'>
            <div className='relative bg-n-8 rounded-[1rem]'>
              <div className='aspect-[33/40] rounded-[0.9rem] md:aspect-[688/490] lg:aspect-[1024/490] relative'>
                <img
                  className='w-full h-full object-cover rounded-[0.9rem]'
                  width={1024}
                  height={490}
                  alt='AI'
                  src='/hero/background.png'
                />

                {/* Overlay Info Box */}
                <div className='absolute inset-0 flex items-center justify-center z-10 lg:flex'>
                  <div className='max-w-lg lg:max-w-xl px-6'>
                    <div className='bg-black/20 backdrop-blur-sm rounded-2xl p-6 lg:p-8'>
                      <h2
                        className='text-3xl lg:text-4xl font-bold text-white mb-4 lg:mb-6 text-left'
                        style={{ opacity: 1, transform: 'none' }}
                      >
                        AI-Powered Innovation
                      </h2>
                      <p
                        className='text-base lg:text-lg text-gray-300 mb-6 lg:mb-8 leading-relaxed text-left'
                        style={{ opacity: 1, transform: 'none' }}
                      >
                        We transform complex AI challenges into elegant
                        solutions that adapt, learn, and evolve with your
                        business needs.
                      </p>

                      <div
                        className='space-y-3 lg:space-y-4'
                        style={{ opacity: 1, transform: 'none' }}
                      >
                        {[
                          'Generative AI Solutions',
                          'Adaptive Learning Systems',
                          'Real-time Intelligence',
                        ].map((text, i) => (
                          <div key={i} className='flex items-center gap-3'>
                            <div className='w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0'>
                              <svg
                                className='w-2.5 h-2.5 lg:w-3 lg:h-3 text-white'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                            <span className='text-white font-medium text-sm lg:text-base'>
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Example of absolute overlay card */}
                <div className='hidden absolute -right-20 top-10 xl:flex z-20 flex items-center justify-center p-4 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl'>
                  <h6 className='font-bold text-lg text-white tracking-wide'>
                    Code generation
                  </h6>
                </div>
                <div className='hidden absolute -right-40 top-1/2 xl:flex z-20 flex items-center justify-center p-4 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl'>
                  <h6 className='font-bold text-lg text-white tracking-wide'>
                    Data Processing
                  </h6>
                </div>
                <div className='hidden absolute -right-20 bottom-10 xl:flex z-20 flex items-center justify-center p-4 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl'>
                  <h6 className='font-bold text-lg text-white tracking-wide'>
                    Neural Networks
                  </h6>
                </div>
                <div className='hidden absolute -left-20 top-10 xl:flex z-20 flex items-center justify-center p-4 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl'>
                  <h6 className='font-bold text-lg text-white tracking-wide'>
                    AI Model Training
                  </h6>
                </div>
                <div className='hidden absolute -left-40 top-1/2 xl:flex z-20 flex items-center justify-center p-4 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl'>
                  <h6 className='font-bold text-lg text-white tracking-wide'>
                    API Integration
                  </h6>
                </div>
                <div className='hidden absolute -left-20 bottom-10 xl:flex z-20 flex items-center justify-center p-4 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl'>
                  <h6 className='font-bold text-lg text-white tracking-wide'>
                    Cloude Deployment
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Background Shapes */}
        {/* <div className='absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]'>
          <img
            className='w-full h-full object-cover'
            alt='hero'
            src='/hero/hero-background.jpg'
          />
        </div> */}
        <div className='absolute inset-0 bg-black z-0 flex items-end justify-center overflow-hidden'>
          <img
            className='object-contain -z-10 max-w-full max-h-full translate-y-1/4 scale-200'
            alt='hero'
            src='/hero/hero-background.jpg'
          />
        </div>

        {/* <div className='absolute inset-0 flex items-center justify-center z-0'>
          <img
            className='w-full h-full object-cover'
            alt='hero'
            src='/hero/hero-background.jpg'
          />
        </div> */}
      </div>
    </section>
  );
}

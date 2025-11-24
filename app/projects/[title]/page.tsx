import Footer from '@/components/footer/Footer';
import Navigation from '@/components/header/Navigation';
import { data } from './data';
import { Button } from '@/components/ui/button';
interface ProjectPageProps {
  params: { title: string };
}
const results = [
  '40% increase in sales conversion',
  'Improved customer satisfaction',
  'Reduced manual follow-up work',
  'Better customer insights',
];
export default async function ProjectDetails({ params }: ProjectPageProps) {
  const { title } = await params;
  console.log(title, params, 1);
  const project = data.find((p) => p.title === decodeURIComponent(title));
  return (
    <div>
      <Navigation />

      <div
        className='
          relative
          py-14 lg:py-20 xl:py-28
          xl:pt-[12rem] 
          pt-[6rem] 
          md:pt-[9rem] 
        '
      >
        <div className='container max-w-[1200px] mx-auto px-4'>
          <div className='relative'>
            {/* Back Button */}
            <div className='mb-8'>
              <a
                className='inline-flex items-center text-[#717585] hover:text-white transition-colors'
                href='/projects'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                Back to Fundamental Projects
              </a>
            </div>

            {/* Header Section */}
            <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 text-center'>
              {/* Status Badge */}
              <div className='flex items-center justify-center mb-6'>
                <div className='flex items-center bg-white  px-4 py-2 bg-n-1 rounded  mr-4'>
                  <img
                    className='mr-2'
                    width={16}
                    height={16}
                    alt='Completed'
                    src='/projects/check-02.svg'
                  />
                  <div className='text-[#0e0c15]  text-sm font-medium'>
                    Completed
                  </div>
                </div>
                <span className=' text-[#757185]'>{project?.completed}</span>
              </div>

              {/* Title */}
              <h1 className='text-6xl leading-[72px] font-bold mb-6'>
                {project?.title}
              </h1>

              {/* Description */}
              <p className='text-xl text-[#757185] mb-8'>
                {project?.description}
              </p>

              {/* Project Info */}
              <div className='flex flex-wrap justify-center gap-4'>
                <div className='text-center'>
                  <p className='caption text-[#757185]'>Client</p>
                  <p className='body-2 text-n-1'>Various Enterprises</p>
                </div>
                {/* Add more info blocks here if needed */}
              </div>
            </div>

            <div className='relative py-10 lg:py-16 xl:py-20'>
              <div className='container max-w-[1200px] mx-auto px-4'>
                {/* Section Header */}
                <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center'>
                  <h2 className='text-white font-bold text-5xl'>
                    Project Screenshots
                  </h2>
                  <p className='text-[16px] mt-4 text-[#757185]'>
                    Visual overview of the project interface and key features
                  </p>
                </div>

                {/* Screenshot Container */}
                <div className='relative max-w-[62rem] mx-auto'>
                  <div className='relative bg-n-8 border border-n-1/10 rounded-3xl overflow-hidden mb-8'>
                    {/* Background Grid */}
                    <div className='absolute top-0 left-0 max-w-full opacity-50'>
                      <img
                        className='w-full'
                        width={550}
                        height={550}
                        alt='Grid'
                        src='/projects/grid.png'
                      />
                    </div>

                    {/* Main Screenshot */}
                    <div className='relative z-10 p-8'>
                      <img
                        className='w-full rounded-2xl'
                        alt='Aaladin CRM Screenshot 1'
                        src={project?.img}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='relative py-10 lg:py-16 xl:py-20'>
          <div className='container max-w-[1200px] mx-auto px-4'>
            <div className='grid gap-12 lg:grid-cols-2'>
              {/* Left Column */}
              <div className='space-y-8'>
                {/* The Challenge */}
                <div className='relative bg-n-8 border border-n-1/10 rounded-3xl p-8'>
                  <h3 className='text-4xl mb-4'>The Challenge</h3>
                  <p className='text-[16px] text-[#757185]'>
                    Traditional CRMs lack AI capabilities and don't provide
                    actionable insights for sales teams.
                  </p>
                </div>

                {/* Our Solution */}
                <div className='relative bg-n-8 border border-n-1/10 rounded-3xl p-8'>
                  <h3 className='text-4xl mb-4'>Our Solution</h3>
                  <p className='text-[16px] text-[#757185]'>
                    Developed AI-enhanced CRM with automation, analytics, and
                    scalable architecture.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-8 lg:pt-16'>
                {/* Technologies Used */}
                <div className='relative bg-n-8 border border-n-1/10 rounded-3xl p-8'>
                  <h3 className='text-4xl mb-6'>Technologies Used</h3>
                  <div className='flex flex-wrap gap-3'>
                    <span className='px-4 py-2  rounded-full text-sm text-white bg-[#252134]'>
                      AI/ML
                    </span>
                    <span className='px-4 py-2  rounded-full text-sm text-white bg-[#252134]'>
                      Customer Analytics
                    </span>
                    <span className='px-4 py-2  rounded-full text-sm text-white bg-[#252134]'>
                      Automation
                    </span>
                    <span className='px-4 py-2  rounded-full text-sm text-white bg-[#252134]'>
                      Cloud Infrastructure
                    </span>
                  </div>
                </div>

                {/* Key Features */}
                <div className='relative bg-n-8 border border-n-1/10 rounded-3xl p-8'>
                  <h3 className='text-4xl mb-6'>Key Features</h3>
                  <ul className='space-y-3'>
                    {[
                      'Centralized customer interactions',
                      'Automated follow-ups',
                      'Lead tracking automation',
                      'Real-time analytics',
                      'Actionable insights',
                      'Scalable architecture',
                    ].map((feature, idx) => (
                      <li key={idx} className='flex items-start'>
                        <img
                          className='mr-3 mt-1 bg-purple-600 rounded-full'
                          width={16}
                          height={16}
                          alt='Check'
                          src='/projects/check-02.svg'
                        />
                        <span className='body-2 text-[#757185]'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='relative py-10 lg:py-16 xl:py-20'>
          <div className='container max-w-[1200px] mx-auto px-4'>
            {/* Section Header */}
            <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center'>
              <h2 className=' text-white font-bold text-5xl'>
                Results & Impact
              </h2>
              <p className='text-[16px] mt-4 text-[#757185]'>
                Measurable outcomes and business impact achieved
              </p>
            </div>

            {/* Results Grid */}
            <div className='relative max-w-[62rem] mx-auto'>
              <div className='relative bg-n-8 border border-n-1/10 rounded-3xl p-8 lg:p-16'>
                {/* Background Grid */}
                <div className='absolute top-0 left-0 max-w-full opacity-50'>
                  <img
                    className='w-full'
                    width={550}
                    height={550}
                    alt='Grid'
                    src='/projects/grid.png'
                  />
                </div>

                {/* Grid Items */}
                <div className='relative z-10'>
                  <div className='grid gap-8 md:grid-cols-2'>
                    {results.map((result, idx) => (
                      <div key={idx} className='text-center'>
                        <div className='w-16 h-16 bg-[conic-gradient(from_225deg,#FFC876,#79FFF7,#9F53FF,#FF98E2,#FFC876)] rounded-full flex items-center justify-center mx-auto mb-4'>
                          <img
                            width={24}
                            height={24}
                            alt='Success'
                            src='/projects/check-02.svg'
                          />
                        </div>
                        <p className='body-1 text-xl font-semibold'>{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='relative py-10 lg:py-16 xl:py-20'>
          <div className='container text-center'>
            <div className='relative max-w-[50rem] mx-auto'>
              <h2 className='text-5xl mb-6'>Ready to Start Your Project?</h2>

              <p className='text-xl text-[#757185] mb-8'>
                Let's discuss how we can help you achieve similar results for
                your business.
              </p>

              <div className='flex flex-wrap justify-center gap-4'>
                {/* Get a Quote Button */}
                <Button
                  className='
      h-11
      px-7
      font-poppins cursor-pointer uppercase bg-transparent 
      border-t-purple-700 border-b-pink-500 border-l-indigo-500 
      dark:text-white hover:bg-transparent border-r-orange-700 
      text-white border-2 rounded
    '
                >
                  Get a Quote
                </Button>

                {/* View More Projects Button */}
                <a href='/projects'>
                  <button
                    className='
      button relative inline-flex cursor-pointer items-center justify-center 
      h-11 px-7 transition-colors hover:text-color-1 
      text-[#0e0c15] bg-white font-medium rounded
    '
                  >
                    <span className='relative z-10'>
                      View More Fundamental Projects
                    </span>

                    <svg
                      className='absolute top-0 left-0'
                      width='21'
                      height='44'
                      viewBox='0 0 21 44'
                    >
                      <path
                        fill='white'
                        stroke='white'
                        strokeWidth='2'
                        d='M21,43.00005 L8.11111,43.00005 C4.18375,43.00005 1,39.58105 1,35.36365 L1,8.63637 C1,4.41892 4.18375,1 8.11111,1 L21,1'
                      />
                    </svg>

                    <svg
                      className='absolute top-0 left-[1.3125rem] w-[calc(100%-2.625rem)]'
                      height='44'
                      viewBox='0 0 100 44'
                      preserveAspectRatio='none'
                      fill='white'
                    >
                      <polygon
                        fill='white'
                        fillRule='nonzero'
                        points='100 0 100 44 0 44 0 0'
                      />
                    </svg>

                    <svg
                      className='absolute top-0 right-0'
                      width='21'
                      height='44'
                      viewBox='0 0 21 44'
                    >
                      <path
                        fill='white'
                        stroke='white'
                        strokeWidth='2'
                        d='M0,43.00005 L5.028,43.00005 L12.24,43.00005 C16.526,43.00005 20,39.58105 20,35.36365 L20,16.85855 C20,14.59295 18.978,12.44425 17.209,10.99335 L7.187,2.77111 C5.792,1.62675 4.034,1 2.217,1 L0,1'
                      />
                    </svg>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

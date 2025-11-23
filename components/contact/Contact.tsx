import { Button } from '../ui/button';

export default function Contact() {
  return (
    <section
      id='contact'
      className='
        relative
        py-14 lg:py-20 xl:py-28
        overflow-hidden
      '
    >
      <div className='container'>
        <div className='relative'>
          {/* Header */}
          <div className='max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center'>
            <div className='tagline flex items-center mb-4 md:justify-center'>
              {/* Left bracket */}
              <svg width='5' height='14' viewBox='0 0 5 14' fill='none'>
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

              <div className='mx-3 text-[#ada8c3]'>
                Ready to Start Your Project?
              </div>

              {/* Right bracket */}
              <svg width='5' height='14' viewBox='0 0 5 14' fill='none'>
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

            <h2 className=' text-5xl'>Get a Quote</h2>
            <p className='text-[16px] mt-4 text-[#757185]'>
              Tell us about your project requirements and we'll provide you with
              a detailed quote within 24 hours.
            </p>
          </div>

          {/* Form Wrapper */}
          <div className='relative z-10 max-w-[62rem] mx-auto'>
            <div className='relative bg-n-8 border border-n-6/30 rounded-3xl overflow-hidden'>
              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-br from-n-8/40 to-n-9/80' />

              <div className='relative z-10 p-8 lg:p-16'>
                <form className='space-y-10'>
                  {/* ===== NAME + EMAIL ===== */}
                  <div className='grid gap-6 md:grid-cols-2'>
                    {/* Full Name */}
                    <div className='relative'>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-[#ada8c3] mb-2'
                      >
                        Full Name
                      </label>
                      <div className='relative p-[2px] rounded-lg bg-[#15131d] focus-within:bg-conic-gradient transition-all duration-300'>
                        <input
                          id='name'
                          name='name'
                          type='text'
                          placeholder='Enter your full name'
                          className='w-full px-4 py-3 bg-n-7 border-0 rounded-[calc(0.5rem-2px)] text-n-1 placeholder-n-4 focus:outline-none transition-all'
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className='relative'>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-[#ada8c3] mb-2'
                      >
                        Email Address
                      </label>
                      <div className='relative p-[2px] rounded-lg bg-[#15131d] focus-within:bg-conic-gradient transition-all duration-300'>
                        <input
                          id='email'
                          name='email'
                          type='email'
                          placeholder='Enter your email address'
                          className='w-full px-4 py-3 bg-n-7 border-0 rounded-[calc(0.5rem-2px)] text-n-1 placeholder-n-4 focus:outline-none'
                        />
                      </div>
                    </div>
                  </div>

                  {/* ===== SERVICES CHECKBOXES ===== */}
                  <div className='relative'>
                    <label className='block text-sm font-medium text-[#ada8c3] mb-4'>
                      Services Required
                    </label>

                    <div className='grid gap-3 md:grid-cols-2'>
                      {[
                        'UI/UX Design',
                        'Web & Mobile Development',
                        'Cloud & DevOps Solutions',
                        'AI & Automation',
                        'API Development & Integration',
                        'Consultancy',
                      ].map((item) => (
                        <label
                          key={item}
                          className='flex items-center cursor-pointer group'
                        >
                          <div className='relative'>
                            <input type='checkbox' className='sr-only' />
                            <div className='w-5 h-5 rounded p-[2px] transition-all bg-[#15131d] group-hover:bg-conic-gradient'>
                              <div className='w-full h-full rounded-sm bg-n-7 transition-all' />
                            </div>
                          </div>
                          <span className='ml-3 text-sm text-[#ada8c3] group-hover:text-n-1 transition-colors'>
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* ===== BUDGET + TIMELINE ===== */}
                  <div className='grid gap-6 md:grid-cols-2'>
                    {/* Budget */}
                    <div className='relative'>
                      <label
                        htmlFor='budget'
                        className='block text-sm font-medium text-[#ada8c3] mb-2'
                      >
                        Budget Range
                      </label>
                      <div className='relative p-[2px] rounded-lg bg-n-6 focus-within:bg-conic-gradient transition-all duration-300'>
                        <select
                          id='budget'
                          name='budget'
                          className='w-full px-4 py-3 bg-[#15131d] border-0 rounded-[calc(0.5rem-2px)] text-n-1 appearance-none cursor-pointer focus:outline-none'
                        >
                          <option value='' className='bg-[#15131d] text-n-4'>
                            Select budget range
                          </option>
                          <option value='5k-15k'>$5,000 - $15,000</option>
                          <option value='15k-30k'>$15,000 - $30,000</option>
                          <option value='30k-50k'>$30,000 - $50,000</option>
                          <option value='50k+'>$50,000+</option>
                        </select>
                        <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
                          <svg
                            className='w-4 h-4 text-n-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path strokeWidth='2' d='M19 9l-7 7-7-7' />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className='relative'>
                      <label
                        htmlFor='timeline'
                        className='block text-sm font-medium text-[#ada8c3] mb-2'
                      >
                        Project Timeline
                      </label>
                      <div className='relative p-[2px] rounded-lg bg-n-6 focus-within:bg-conic-gradient transition-all duration-300'>
                        <select
                          id='timeline'
                          name='timeline'
                          className='w-full px-4 py-3 bg-[#15131d] border-0 rounded-[calc(0.5rem-2px)] text-n-1 appearance-none cursor-pointer focus:outline-none'
                        >
                          <option value='' className='bg-[#15131d] text-n-4'>
                            Select timeline
                          </option>
                          <option value='asap'>ASAP (Rush job)</option>
                          <option value='1-2months'>1-2 months</option>
                          <option value='3-6months'>3-6 months</option>
                          <option value='6months+'>6+ months</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ===== ADDITIONAL DETAILS ===== */}
                  <div className='relative'>
                    <label
                      htmlFor='details'
                      className='block text-sm font-medium text-[#ada8c3] mb-2'
                    >
                      Additional Details
                    </label>
                    <div className='relative p-[2px] rounded-lg bg-n-6 focus-within:bg-conic-gradient transition-all duration-300'>
                      <textarea
                        id='details'
                        name='details'
                        rows={4}
                        placeholder='Tell us more about your project goals, specific requirements, or any questions you have... (minimum 20 words)'
                        className='w-full px-4 py-3 bg-[#15131d] border-0 rounded-[calc(0.5rem-2px)] text-white placeholder-n-4 focus:border-t-purple-400 focus:border-b-orange-400 focus:border-r-blue-400 focus:border-l-pink-400 focus:border-b-4 border-t-[#252139] border-b-[#252139] border-r-[#252139] border-l-[#252139] border-b-4 focus:border focus:outline-none resize-none'
                      />
                    </div>
                  </div>

                  {/* ===== SUBMIT BTN ===== */}
                  <div className='flex justify-center pt-4'>
                    <Button className='font-poppins cursor-pointer uppercase bg-transparent border-t-purple-700 border-b-pink-500 border-l-indigo-500 dark:text-white hover:bg-transparent border-r-orange-700 text-black border-2'>
                      <span className='relative z-10'>Get Quote</span>
                    </Button>
                  </div>
                </form>

                {/* ===== FOOTER INFO ===== */}
                <div className='mt-12 pt-8 border-t border-n-6'>
                  <div className='grid gap-8 md:grid-cols-3 text-center'>
                    {[
                      ['Email Us', 'contact@aaladinai.com'],
                      ['Quick Response', 'Within 24 hours'],
                      ['Free Consultation', '30-minute discovery call'],
                    ].map(([title, text]) => (
                      <div key={title} className='flex flex-col items-center'>
                        <div className='w-12 h-12 bg-[conic-gradient(from_225deg,#FFC876,#79FFF7,#9F53FF,#FF98E2,#FFC876)] rounded-full flex items-center justify-center mb-4'>
                          <img
                            className='bg-purple-600 rounded-full'
                            src='/projects/check-02.svg'
                            width={20}
                            height={20}
                            alt={title}
                          />
                        </div>
                        <h6 className='text-[18px] font-semibold mb-2'>
                          {title}
                        </h6>
                        <p className='text-[16px] text-[#757185]'>{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

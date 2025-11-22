import {
  Sparkles,
  Users,
  UsersRound,
  Globe,
  Headset,
  ArrowRight,
} from 'lucide-react';

// import HeroClient from './HeroClient';
// import BookACallCalendly from './BookACallCalendly';
import Link from 'next/link';
import { WorldMap } from '../ui/world-map';
import HeroClient from './HeroClient';
import BookACallCalendly from './BookACallCalendly';

export default function Hero() {
  return (
    <section
      id='home'
      className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-[#15082F] dark:via-[#15082F] dark:to-[#15082F] pt-20'
    >
      {/* Floating Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <WorldMap
        // dots={[
        //   {
        //     start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
        //     end: { lat: 40.7128, lng: -74.006 }, // New York
        //   },
        //   {
        //     start: { lat: 51.5074, lng: -0.1278 }, // London
        //     end: { lat: 48.8566, lng: 2.3522 }, // Paris
        //   },
        // ]}
        />
        {/* <img
          src='/World_map_(blue_dots).svg'
          alt='world map'
          className='w-full h-full object-cover opacity-10 dark:opacity-15'
        /> */}
        <div className='absolute top-20 left-10 w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
        <div className='absolute top-40 right-20 w-3 h-3 bg-purple-500 rounded-full animate-bounce'></div>
        <div className='absolute bottom-32 left-32 w-1 h-1 bg-indigo-500 rounded-full animate-ping'></div>
        <div className='absolute top-60 left-1/4 w-2 h-2 bg-green-500 rounded-full animate-pulse delay-500'></div>
        <div className='absolute bottom-40 right-1/3 w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-700'></div>
      </div>
      {/* Floating Icons */}
      {/* Left Top */}
      {/* <div className='absolute top-20 left-12 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float z-10'>
        <Code className='w-8 h-8 text-blue-600' />
      </div> */}

      {/* Left Bottom */}
      {/* <div className='absolute bottom-20 left-14 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-500 z-10'>
        <Zap className='w-8 h-8 text-orange-600' />
      </div> */}

      {/* Right Top */}
      {/* <div className='absolute top-32 right-12 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-300 z-10'>
        <Database className='w-8 h-8 text-purple-600' />
      </div> */}

      {/* Right Bottom */}
      {/* <div className='absolute bottom-32 right-14 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-700 z-10'>
        <Shield className='w-8 h-8 text-green-600' />
      </div> */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 opacity-100 translate-y-0"
        }`}
      >
        <div className='grid lg:grid-cols-1 gap-12 items-center'>
          {/* Left Content */}
          <div className='text-center'>
            {/* Badge */}
            <div className='mb-6 '>
              <Link
                href='/start'
                className='inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors'
              >
                <Sparkles className='w-4 h-4 mr-2' />
                Hello Founders
                <ArrowRight className='w-4 h-4 ml-2' />
              </Link>
            </div>

            {/* Main Heading */}
            <div className='mb-8  animation-delay-200'>
              <h1 className='font-space-grotesk text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight'>
                Ready To Transform Your Digital Presence? <br />
                {/* <span className='relative'>{<HeroClient />}</span> */}
              </h1>

              <p className='font-poppins text-xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl'>
                Let's discuss how our AI-powered solutions can help your
                business growth.{' '}
                <Link className='underline' href='/ai-audit'>
                  Get Free AI Audit.
                </Link>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className='mb-12  animation-delay-400'>
              <div className='flex justify-center w-full gap-4'>
                {/* <Link href='/contact'> */}
                <BookACallCalendly />
                {/* </Link> */}

                {/* <Link href='/case-studies'>
                  <Button
                    variant='outline'
                    size='lg'
                    className='font-poppins font-semibold px-8 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200'
                  >
                    View Our Work
                  </Button>
                </Link> */}
              </div>
            </div>

            {/* Stats */}
            {/* <div className=' animation-delay-600'>
              <div className='flex justify-between gap-8'>
                <div>
                  <div className='font-space-grotesk text-3xl font-bold text-gray-900 dark:text-white'>
                    50+
                  </div>
                  <div className='font-poppins text-sm text-gray-600 dark:text-gray-400'>
                    Projects Delivered
                  </div>
                </div>
                <div>
                  <div className='font-space-grotesk text-3xl font-bold text-gray-900 dark:text-white'>
                    98%
                  </div>
                  <div className='font-poppins text-sm text-gray-600 dark:text-gray-400'>
                    Client Satisfaction
                  </div>
                </div>
                <div>
                  <div className='font-space-grotesk text-3xl font-bold text-gray-900 dark:text-white'>
                    24/7
                  </div>
                  <div className='font-poppins text-sm text-gray-600 dark:text-gray-400'>
                    Support Available
                  </div>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Visual */}
          {/* <div className='relative  animation-delay-800'> */}
          {/* <div className='relative'> */}
          {/* Main Circle */}
          {/* <div className='w-80 h-80 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl'>
                <div className='w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center'>
                  <Brain className='w-24 h-24 text-white' />
                </div>
              </div> */}

          {/* Floating Icons */}
          {/* <div className='absolute -top-8 left-8 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float'>
                <Code className='w-8 h-8 text-blue-600' />
              </div>

              <div className='absolute top-12 -right-8 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-300'>
                <Database className='w-8 h-8 text-purple-600' />
              </div>

              <div className='absolute -bottom-8 right-12 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-500'>
                <Shield className='w-8 h-8 text-green-600' />
              </div>

              <div className='absolute bottom-16 -left-12 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center animate-float animation-delay-700'>
                <Zap className='w-8 h-8 text-orange-600' />
              </div> */}
          {/* </div> */}
          {/* </div> */}
        </div>

        {/* Bottom Features */}
        <div className='mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 animation-delay-1000'>
          {/* Professionals */}
          <div className='text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 hover:scale-105 transition-transform duration-200'>
            <Users className='w-8 h-8 text-blue-600 mx-auto mb-3' />
            <div>
              <div className='font-space-grotesk text-3xl font-bold text-gray-900 dark:text-white'>
                10+
              </div>
              <div className='font-poppins text-sm text-gray-600 dark:text-gray-400'>
                AI Experts
              </div>
            </div>
          </div>

          {/* Users Impacted */}
          <div className='text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 hover:scale-105 transition-transform duration-200'>
            <UsersRound className='w-8 h-8 text-purple-600 mx-auto mb-3' />
            <div>
              <div className='font-space-grotesk text-3xl font-bold text-gray-900 dark:text-white'>
                35M+
              </div>
              <div className='font-poppins text-sm text-gray-600 dark:text-gray-400'>
                User Impacted
              </div>
            </div>
          </div>

          {/* Countries Served */}
          <div className='text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 hover:scale-105 transition-transform duration-200'>
            <Globe className='w-8 h-8 text-orange-600 mx-auto mb-3' />
            <div>
              <div className='font-space-grotesk text-3xl font-bold text-gray-900 dark:text-white'>
                12+
              </div>
              <div className='font-poppins text-sm text-gray-600 dark:text-gray-400'>
                Countries Served
              </div>
            </div>
          </div>

          {/* Support Available */}
          <div className='text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-slate-700/50 hover:scale-105 transition-transform duration-200'>
            <Headset className='w-8 h-8 text-green-600 mx-auto mb-3' />
            <div>
              <div className='font-space-grotesk text-3xl font-bold text-gray-900 dark:text-white'>
                24/7
              </div>
              <div className='font-poppins text-sm text-gray-600 dark:text-gray-400'>
                Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

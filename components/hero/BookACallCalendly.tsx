'use client';
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
declare global {
  interface Window {
    Calendly: any;
  }
}
const BookACallCalendly = () => {
  useEffect(() => {
    // Load Calendly CSS
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load Calendly script if not already loaded
    if (!window.Calendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      // script.onload = () => {
      //   // Initialize badge widget once script is loaded
      //   if (window.Calendly) {
      //     window.Calendly.initBadgeWidget({
      //       url: 'https://calendly.com/arkhq/discovery-call',
      //       text: 'BOOK A CALLop',
      //       color: '#0069ff',
      //       textColor: '#ffffff',
      //     });
      //   }
      // };
      document.head.appendChild(script);
    }
    // else {
    //   // If Calendly is already loaded, initialize badge widget
    //   window.Calendly.initBadgeWidget({
    //     url: 'https://calendly.com/arkhq/discovery-call',
    //     text: 'BOOK A CALLiu',
    //     color: '#0069ff',
    //     textColor: '#ffffff',
    //   });
    // }
  }, []);
  return (
    <div>
      {' '}
      <Button
        size='lg'
        className='font-poppins  !bg-gradient-to-r !from-[#a855f7] !to-purple-600 hover:!from-[#a855f7] hover:!to-purple-700 !text-white border-0'
      >
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            if (window.Calendly) {
              window.Calendly.initPopupWidget({
                url: 'https://calendly.com/arkhq/discovery-call',
              });
            }
            return false;
          }}
          className='inline-flex items-center px-6 py-3   text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl'
        >
          BOOK A CALL
        </a>
        {/* <ArrowRight className='ml-2 h-5 w-5' /> */}
      </Button>
    </div>
  );
};

export default BookACallCalendly;

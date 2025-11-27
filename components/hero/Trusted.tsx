import React from 'react';

const Trusted = () => {
  return (
    <div className='relative  mt-14  z-10'>
      <div className='max-w-3xl mx-auto relative z-10'>
        <div className=''>
          <div className='text-center mb-12'>
            <h3 className='text-sm font-medium text-[#00000099] dark:text-gray-400 uppercase tracking-wide mb-8'>
              Our Clients
            </h3>
          </div>
          <div className='max-w-full mx-auto'>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-8 items-center justify-items-center'>
              {[
                { alt: 'Fuel AI Logo', src: '/truested/fuelai-logo.webp' },
                { alt: 'Fly Nepal Logo', src: '/truested/flynepal.webp' },
                {
                  alt: 'Julfikar Steel Logo',
                  src: '/truested/julfikar-steel.webp',
                },
                {
                  alt: 'Ridge Park Logo',
                  src: '/truested/ridge-park.webp',
                },
                { alt: 'My TV Logo', src: '/truested/my-tv.webp' },
                { alt: 'Jamuna TV Logo', src: '/truested/jamuna-tv.webp' },
                { alt: 'MediGuru Logo', src: '/truested/mediguru.webp' },
                { alt: 'City Pass Logo', src: '/truested/city-pass.webp' },
              ].map((logo, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-center h-8 w-16 transition-all duration-300 hover:scale-105 group'
                >
                  <img
                    alt={logo.alt}
                    src={logo.src}
                    className='w-full h-full object-contain transition-all duration-300
                     filter grayscale  opacity-60 group-hover:opacity-90 
                      dark:opacity-70 dark:group-hover:opacity-95'
                    style={{ minWidth: '40px', minHeight: '20px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trusted;

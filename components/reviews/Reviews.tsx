import { Sparkles } from 'lucide-react';
import { EmblaOptionsType } from 'embla-carousel';
import EmblaReviewCarousel from './EmblaReviewCarousel';

const OPTIONS: EmblaOptionsType = { loop: true };

const Reviews = () => {
  return (
    <div id='reviews' className='py-24 bg-white dark:bg-[#15082F]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center space-y-6 mb-16'>
          <div className='inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/50 rounded-full'>
            <Sparkles className='h-4 w-4 text-purple-600 dark:text-purple-400 mr-2' />
            <span className='text-sm font-semibold text-purple-800 dark:text-purple-300'>
              Client Reviews
            </span>
          </div>

          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold'>
            <span className='bg-gradient-to-r from-gray-900 to-purple-800 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent'>
              What Our Clients Say
            </span>
          </h2>

          <p className='max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
            We’re proud to have worked with incredible clients from all around
            the world. Here’s what they think about our collaboration,
            performance, and commitment.
          </p>
        </div>

        {/* Carousel */}
        <div>
          <EmblaReviewCarousel options={OPTIONS} />
        </div>
      </div>
    </div>
  );
};

export default Reviews;

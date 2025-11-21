'use client';

import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoscroll from 'embla-carousel-auto-scroll';
import { EmblaOptionsType } from 'embla-carousel';
import { reviewsData } from './reviewsData';
import ReviewCard from './ReviewCard';

type PropType = {
  options?: EmblaOptionsType;
};

const EmblaReviewCarousel: React.FC<PropType> = ({ options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      ...options,
    },
    [
      Autoscroll({
        playOnInit: true,
        stopOnInteraction: false,
        speed: 2,
        direction: 'forward',
      }),
    ]
  );

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi]);

  return (
    <section className='embla'>
      <div className='embla__viewport' ref={emblaRef}>
        <div className='embla__container'>
          {reviewsData.map((review) => (
            <div className='embla__slide' key={review.id}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaReviewCarousel;

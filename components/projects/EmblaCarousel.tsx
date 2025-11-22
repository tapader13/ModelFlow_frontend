'use client';
import React, { useEffect } from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import ProjectCard from './ProjectCard';
import Autoscroll from 'embla-carousel-auto-scroll';
import { caseStudies } from './data';

type PropType = {
  options?: EmblaOptionsType;
  autoplayInterval?: number;
};
const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true, // enables infinite looping
      ...options,
    },
    [
      Autoscroll({
        playOnInit: true,
        stopOnInteraction: false,
        speed: 2,
        direction: 'backward',
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
          {caseStudies.map((caseStudy) => (
            <div className='embla__slide' key={caseStudy.id}>
              {/* <div className='embla__slide__number'>{caseStudy.title}</div> */}
              <ProjectCard key={caseStudy.id} project={caseStudy} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;

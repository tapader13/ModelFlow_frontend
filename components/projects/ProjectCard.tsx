'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProjectType } from './types';

interface ProjectCardProps {
  project: ProjectType;
}

// just test

export default function ProjectCard({ project }: ProjectCardProps) {
  const getImageIndex = (index: number) => {
    switch (index) {
      case 1:
        return 3;
      case 2:
        return 1;
      case 3:
        return 0;
      case 4:
        return 2;
      case 5:
      case 6:
      case 7:
      case 8:
        return 0;
      case 9:
        return 9;
      case 10:
        return 2;
      default:
        return 0;
    }
  };

  return (
    <Link href={`/case-studies/${project.title}`}>
      <div className='group'>
        <div className='rounded-2xl overflow-hidden shadow-lg dark:shadow-black/50 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-transparent hover:border-purple-500'>
          {/* Image */}
          <div className='relative overflow-hidden aspect-video'>
            <Image
              alt={project.title}
              src={project.demoImages[getImageIndex(project.id)]}
              fill
              className='object-cover transition-transform duration-500 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
          </div>

          {/* Content */}
          <div className='p-5 sm:p-6 flex flex-col justify-between h-full'>
            <div className='space-y-3'>
              <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors'>
                {project.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base line-clamp-3'>
                {project.description}
              </p>
            </div>

            {/* Details View Button */}
            <div className='mt-4'>
              <div className='inline-flex items-center gap-2 text-purple-500 font-semibold group-hover:translate-x-1 transition-transform'>
                Details View <ArrowRight className='h-4 w-4' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

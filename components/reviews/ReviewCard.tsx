import { Star } from 'lucide-react';
import Image from 'next/image';

type ReviewCardProps = {
  id: number;
  name: string;
  title: string;
  review: string;
  rating: number;
  avatar: string;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  title,
  review,
  rating,
  avatar,
}) => {
  return (
    <div className='bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 sm:p-8 text-center max-w-md mx-auto border border-gray-200 dark:border-gray-700'>
      <div className='flex justify-center mb-4'>
        <Image
          src={avatar}
          alt={name}
          width={70}
          height={70}
          className='rounded-full border-2 border-purple-600 dark:border-purple-400 flex-shrink-0'
        />
      </div>
      <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
        {name}
      </h3>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>{title}</p>
      <p className='text-gray-700 dark:text-gray-300 mb-4 leading-relaxed line-clamp-4'>
        “{review}”
      </p>
      <div className='flex justify-center gap-1 text-purple-600 dark:text-purple-400'>
        {Array.from({ length: rating }, (_, i) => (
          <Star key={i} className='w-5 h-5 fill-current' />
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;

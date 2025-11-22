'use client';

import { useEffect, useState } from 'react';
import '../app/preloader.css';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className='preloader'>
      <div className='loader'>
        <span className='text'>
          X<span className='highlight'>LAB</span>
        </span>
        <div className='loading-bar'></div>
      </div>
    </div>
  );
}

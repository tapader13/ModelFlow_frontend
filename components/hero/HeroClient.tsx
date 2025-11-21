'use client';
import React, { useEffect, useState } from 'react';

const HeroClient = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = ['AI Agents', 'Web App', 'Mobile App', 'Ecommerse ', 'SaaS'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);
  return (
    <span className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'>
      {texts[currentText]}
    </span>
  );
};

export default HeroClient;

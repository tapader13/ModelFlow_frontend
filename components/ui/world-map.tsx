'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DottedMap from 'dotted-map';
import Image from 'next/image';

import { useTheme } from 'next-themes';

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export function WorldMap({ dots = [], lineColor = '#A78BFA' }: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = useMemo(
    () => new DottedMap({ height: 100, grid: 'diagonal' }),
    []
  );

  const { theme, resolvedTheme } = useTheme();
  const [svgMap, setSvgMap] = useState<string>('');

  // Use resolvedTheme which handles SSR better, fallback to theme, then to 'light'
  const currentTheme = resolvedTheme || theme || 'light';

  useEffect(() => {
    const generatedSvg = map.getSVG({
      radius: 0.22,
      color: currentTheme === 'dark' ? '#FFFFFF40' : '#00000040',
      shape: 'circle',
      backgroundColor: 'transparent',
    });
    setSvgMap(generatedSvg);
  }, [currentTheme, map]);

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div
      className='w-full aspect-2/1 rounded-lg relative font-sans 
  overflow-hidden 
  md:scale-100 scale-[1.8] md:translate-x-0 translate-x-[-20%] 
  origin-center transition-transform duration-700'
    >
      {' '}
      {svgMap && (
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className='h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none'
          alt='world map'
          height={495}
          width={1056}
          draggable={false}
        />
      )}
      <svg
        ref={svgRef}
        viewBox='0 0 800 400'
        className='w-full h-full absolute inset-0 pointer-events-none select-none'
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill='none'
                stroke='url(#path-gradient)'
                strokeWidth='1'
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: 'easeOut',
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id='path-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#D8B4FE' stopOpacity='0' />
            <stop offset='5%' stopColor='#A78BFA' stopOpacity='1' />
            <stop offset='95%' stopColor='#7C3AED' stopOpacity='1' />
            <stop offset='100%' stopColor='#D8B4FE' stopOpacity='0' />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r='2'
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r='2'
                fill={lineColor}
                opacity='0.5'
              >
                <animate
                  attributeName='r'
                  from='2'
                  to='8'
                  dur='1.5s'
                  begin='0s'
                  repeatCount='indefinite'
                />
                <animate
                  attributeName='opacity'
                  from='0.5'
                  to='0'
                  dur='1.5s'
                  begin='0s'
                  repeatCount='indefinite'
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r='2'
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r='2'
                fill={lineColor}
                opacity='0.5'
              >
                <animate
                  attributeName='r'
                  from='2'
                  to='8'
                  dur='1.5s'
                  begin='0s'
                  repeatCount='indefinite'
                />
                <animate
                  attributeName='opacity'
                  from='0.5'
                  to='0'
                  dur='1.5s'
                  begin='0s'
                  repeatCount='indefinite'
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}

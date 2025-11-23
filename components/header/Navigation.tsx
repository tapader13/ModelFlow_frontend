'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
} from '@/components/ui/resizable-navbar';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { ModeToggle } from '../ModeToggle';

interface NavLink {
  name: string;
  link: string;
  subtitle?: string;
}

interface NavGroup {
  title: string;
  links: NavLink[];
}

interface NavItem {
  name: string;
  link?: string;
  megaMenu?: NavGroup[];
}

const XlabLogo = () => (
  <Link
    href='/'
    className='relative z-20 mr-4 flex items-center space-x-3 px-2 py-1'
  >
    <Image
      src='/arklab-icon-modified.png'
      alt='Arklab Logo'
      width={30}
      height={30}
      className='h-6 w-6 object-contain'
    />
    <span className='text-xl font-bold font-space-grotesk text-black dark:text-white whitespace-nowrap'>
      X<span className=' text-[#a855f7]'>LAB</span>
    </span>
  </Link>
);

export default function Navigation() {
  const navItems: NavItem[] = [
    {
      name: 'HOME',
      link: '/',
    },
    {
      name: 'PROJECTS',
      megaMenu: [
        {
          title: 'Projects',
          links: [
            {
              name: 'FUNDAMENTAL PROJECTS',
              link: '/projects',
              subtitle: 'Explore our core projects',
            },
            {
              name: 'INCRMENTAL PROJECTS',
              link: '/incremental-projects',
              subtitle: 'Discover our incremental innovations',
            },
          ],
        },
      ],
    },
    {
      name: 'NEWSLETTER',
      link: '/newsletter',
    },
  ];

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && menuRefs.current[activeMenu]) {
        if (!menuRefs.current[activeMenu]?.contains(event.target as Node)) {
          setActiveMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  const handleMenuEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(itemName);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleMegaMenuEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMegaMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <div className='relative w-full'>
      <Navbar>
        <NavBody>
          <XlabLogo />

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-6 relative'>
            {navItems.map((item) => (
              <div
                key={item.name}
                className='relative'
                ref={(el) => {
                  menuRefs.current[item.name] = el;
                }}
                onMouseEnter={() => handleMenuEnter(item.name)}
                onMouseLeave={handleMenuLeave}
              >
                {item.link ? (
                  <Link
                    href={item.link}
                    className='text-gray-800 dark:text-gray-200 font-medium hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200 py-2 px-1'
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button className='flex items-center gap-1 text-gray-800 dark:text-gray-200 font-medium hover:text-purple-500  transition-colors duration-200 py-2 px-1'>
                    {item.name}
                    {item.megaMenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeMenu === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                )}

                {/* Mega Menu */}
                {item.megaMenu && activeMenu === item.name && (
                  <div
                    className='absolute left-0 top-full mt-0 z-50'
                    onMouseEnter={handleMegaMenuEnter}
                    onMouseLeave={handleMegaMenuLeave}
                  >
                    <div className='bg-white dark:bg-[#111] text-gray-800 dark:text-gray-200 shadow-xl rounded-2xl p-8 inline-block border border-gray-700/20'>
                      <div className='flex gap-8'>
                        {item.megaMenu.map((column, colIdx) => (
                          <div key={colIdx} className='min-w-[200px]'>
                            {/* <h4 className='font-semibold mb-4 text-blue-600 dark:text-blue-400 text-base'>
                              {column.title}
                            </h4> */}
                            <ul className='space-y-4'>
                              {column.links.map((link) => (
                                <li key={link.name}>
                                  <Link
                                    href={link.link}
                                    className='group block hover:text-purple-500 dark:hover:text-purple-400 transition-colors duration-200'
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    <div className='font-medium text-sm group-hover:text-purple-500 dark:group-hover:text-purple-400'>
                                      {link.name}
                                    </div>
                                    {link.subtitle && (
                                      <div className='text-xs text-gray-600 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 line-clamp-2'>
                                        {link.subtitle}
                                      </div>
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Side */}
          <div className='flex items-center gap-2'>
            <ModeToggle />
            <NavbarButton
              variant='primary'
              href='/contact'
              className='font-poppins bg-transparent border-t-purple-700 border-b-pink-500 border-l-indigo-500 dark:text-white border-r-orange-700 text-black border-2'
            >
              GET A QUOTE
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav>
          <MobileNavHeader>
            <XlabLogo />
            <div className='flex items-center gap-2'>
              <ModeToggle />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>
        </MobileNav>
      </Navbar>
    </div>
  );
}

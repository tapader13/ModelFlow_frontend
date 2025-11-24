'use client';
import { cn } from '@/lib/utils';
import { IconMenu2, IconX } from '@tabler/icons-react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';
import { ModeToggle } from '../ModeToggle';

interface NavItem {
  name: string;
  link?: string;
  submenu?: NavItem[];
}

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}
export const MobileNav = ({ className, visible }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  // Define navigation items with nested submenus
  const navItems: NavItem[] = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Projects',
      // link: '/resources',
      submenu: [
        { name: 'FUNDAMENTAL PROJECTS', link: '/projects' },
        { name: 'INCRMENTAL PROJECTS', link: '/incremental-projects' },
      ],
    },
    {
      name: 'NEWSLETTER',
      link: '/newsletter',
    },
  ];

  const toggleMenu = (menuPath: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuPath]: !prev[menuPath],
    }));
  };

  const isMenuExpanded = (menuPath: string) => {
    return !!expandedMenus[menuPath];
  };

  return (
    <motion.div
      animate={{
        width: visible ? '90%' : '100%', // shared width
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 40 }}
      className='mx-auto w-full max-w-[calc(100vw-2rem)] lg:hidden '
    >
      {/* Mobile Nav Header (always visible) */}
      <motion.div
        animate={{
          backdropFilter: visible ? 'blur(10px)' : 'none',
          boxShadow: visible
            ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
            : 'none',
          paddingRight: visible ? '12px' : '0px',
          paddingLeft: visible ? '12px' : '0px',
          borderRadius: visible ? '4px' : '2rem',
          y: visible ? 20 : 0,
          // width: visible ? '90%' : '100%',
        }}
        // transition={{
        //   type: 'spring',
        //   stiffness: 200,
        //   damping: 50,
        // }}
        className={cn(
          'relative z-50  flex   items-center justify-between rounded-lg bg-transparent px-0 py-2  ',
          visible && 'bg-white/80 mb-10 dark:bg-neutral-950/80',
          className
        )}
      >
        <Link
          href='/'
          className='relative z-20 mr-4 flex items-center space-x-3 px-2 py-1'
        >
          {' '}
          {/* <Image
            src='/arklab-icon-modified.png'
            alt='Arklab Logo'
            width={30}
            height={30}
            className='h-6 w-6 object-contain'
          /> */}
          <span className='text-xl font-bold font-space-grotesk text-black dark:text-white whitespace-nowrap'>
            X<span className=' text-[#a855f7]'>LAB</span>
          </span>
        </Link>
        <div className='flex items-center gap-2'>
          <ModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800'
          >
            {isOpen ? (
              <IconX className='h-6 w-6 text-black dark:text-white' />
            ) : (
              <IconMenu2 className='h-6 w-6 text-black dark:text-white' />
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu (appears below with 10px gap when hamburger is clicked) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              // marginTop: '10px', // This creates the gap
              // width: visible ? '90%' : '100%',
            }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'relative  z-40  rounded-lg bg-white/90 px-4 py-4 dark:bg-neutral-950/90 ',
              visible && 'backdrop-blur-md'
            )}
          >
            <div className='space-y-4'>
              {/* Main navigation items */}
              {navItems.map((item) => (
                <div key={item.name} className='w-full'>
                  <div className='flex items-center justify-between'>
                    {/* Clickable text */}
                    {item.link ? (
                      <Link
                        href={item.link}
                        className='block py-2 text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-medium'
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className='block py-2 text-gray-800 dark:text-gray-200 font-medium'>
                        {item.name}
                      </span>
                    )}

                    {/* Arrow for submenu */}
                    {item.submenu && (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800'
                      >
                        <ChevronRight
                          className={`h-5 w-5 transition-transform ${
                            isMenuExpanded(item.name) ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* First-level submenu */}
                  {item.submenu && isMenuExpanded(item.name) && (
                    <div className='ml-4 space-y-2 border-l border-gray-200 dark:border-neutral-700 pl-3 mt-1'>
                      {item.submenu.map((subItem) => (
                        <div
                          key={`${item.name}-${subItem.name}`}
                          className='w-full'
                        >
                          <div className='flex items-center justify-between'>
                            {/* Submenu text is clickable if it has a link */}
                            {subItem.link ? (
                              <Link
                                href={subItem.link}
                                className='block py-1.5 pl-3 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                              >
                                {subItem.name}
                              </Link>
                            ) : (
                              <span className='block py-1.5 pl-3 text-gray-600 dark:text-gray-300'>
                                {subItem.name}
                              </span>
                            )}

                            {/* Arrow toggles sub-submenu */}
                            {subItem.submenu && (
                              <button
                                onClick={() =>
                                  toggleMenu(`${item.name}-${subItem.name}`)
                                }
                                className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800'
                              >
                                <ChevronRight
                                  className={`h-4 w-4 transition-transform ${
                                    isMenuExpanded(
                                      `${item.name}-${subItem.name}`
                                    )
                                      ? 'rotate-90'
                                      : ''
                                  }`}
                                />
                              </button>
                            )}
                          </div>

                          {/* Second-level submenu */}
                          {subItem.submenu &&
                            isMenuExpanded(`${item.name}-${subItem.name}`) && (
                              <div className='ml-4 space-y-1 border-l border-gray-200 dark:border-neutral-700 pl-3'>
                                {subItem.submenu.map((subSubItem) => (
                                  <Link
                                    key={subSubItem.name}
                                    href={subSubItem.link || '#'}
                                    className='block py-1 pl-3 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                                  >
                                    {subSubItem.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Contact section */}
              <div className='pt-4 border-t flex justify-center border-gray-200 dark:border-neutral-800 mt-4'>
                <Link className='w-full cursor-pointer' href='/contact'>
                  {' '}
                  <Button
                    size='lg'
                    className='font-poppins font-semibold w-full  bg-linear-to-r from-[#a855f7] to-purple-600 hover:from-[#a855f7] hover:to-purple-700 text-white border-0'
                  >
                    Contact
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn('fixed inset-x-0 top-0 z-40 w-full', className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? 'blur(10px)' : 'none',
        boxShadow: visible
          ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
          : 'none',
        width: visible ? '40%' : '100%',
        y: visible ? 20 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: '950px',
      }}
      className={cn(
        'relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent',
        visible && 'bg-white/80 dark:bg-neutral-950/80',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
//   const [isOpen, setIsOpen] = useState(false);

//   // Debug: Add console log to check if component renders
//   console.log('MobileNav rendering, isOpen:', isOpen, 'visible:', visible);

//   return (
//     <motion.div
//       animate={{
//         backdropFilter: visible ? 'blur(10px)' : 'none',
//         boxShadow: visible
//           ? '0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset'
//           : 'none',
//         width: visible ? '90%' : '100%',
//         paddingRight: visible ? '12px' : '0px',
//         paddingLeft: visible ? '12px' : '0px',
//         borderRadius: visible ? '4px' : '2rem',
//         y: visible ? 20 : 0,
//       }}
//       transition={{
//         type: 'spring',
//         stiffness: 200,
//         damping: 50,
//       }}
//       className={cn(
//         // Make sure it's visible on mobile and hidden on desktop
//         'relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden',
//         // Add more visible background for debugging
//         'border border-red-500', // REMOVE THIS AFTER DEBUGGING
//         visible && 'bg-white/80 dark:bg-neutral-950/80',
//         className
//       )}
//       style={{
//         minHeight: isOpen ? '300px' : '50px',
//       }}
//     >
//       {children}
//       {/* {React.Children.map(children, (child) => {
//         if (React.isValidElement(child)) {
//           if (child.type === MobileNavHeader) {
//             return React.cloneElement(child as React.ReactElement, {
//               children: React.Children.map(
//                 child.props.children,
//                 (grandChild) => {
//                   if (
//                     React.isValidElement(grandChild) &&
//                     grandChild.type === MobileNavToggle
//                   ) {
//                     return React.cloneElement(
//                       grandChild as React.ReactElement,
//                       {
//                         isOpen,
//                         onClick: () => {
//                           console.log(
//                             'Toggle clicked, isOpen will be:',
//                             !isOpen
//                           ); // Debug
//                           setIsOpen(!isOpen);
//                         },
//                       }
//                     );
//                   }
//                   return grandChild;
//                 }
//               ),
//             });
//           } else if (child.type === MobileNavMenu) {
//             return React.cloneElement(child as React.ReactElement, {
//               isOpen,
//               onClose: () => setIsOpen(false),
//             });
//           }
//         }
//         return child;
//       })} */}
//     </motion.div>
//   );
// };

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between px-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800'
    >
      {isOpen ? (
        <IconX className='h-6 w-6 text-black dark:text-white' />
      ) : (
        <IconMenu2 className='h-6 w-6 text-black dark:text-white' />
      )}
    </button>
  );
};

export const MobileNavMenu = ({
  items,
  isOpen,
  onClose,
}: {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  console.log('MobileNavMenu rendering, isOpen:', isOpen); // Debug

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'w-full overflow-hidden mt-2', // Changed positioning
            'bg-white dark:bg-neutral-950', // Solid background for debugging
            'border border-gray-200 dark:border-neutral-800', // Add border
            'rounded-lg shadow-lg' // Better styling
          )}
        >
          <div className='px-4 py-4 space-y-2'>
            {items.map((item, index) => (
              <div key={`${item.name}-${index}`} className='py-1'>
                <Link
                  href={item.link || '#'}
                  onClick={onClose}
                  className='block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 px-2 rounded hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors'
                >
                  {item.name}
                </Link>
                {/* Add submenu support for mobile */}
                {item.submenu && (
                  <div className='ml-4 mt-2 space-y-1'>
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={`${subItem.name}-${subIndex}`}
                        href={subItem.link || '#'}
                        onClick={onClose}
                        className='block text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 px-2 rounded hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors'
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileNavItem = ({
  item,
  depth = 0,
  onItemClick,
}: {
  item: NavItem;
  depth?: number;
  onItemClick?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  return (
    <div className='w-full'>
      <div
        className='flex items-center justify-between py-2'
        style={{ paddingLeft: depth * 16 }}
      >
        {item.link ? (
          <Link
            href={item.link}
            onClick={onItemClick}
            className='text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400'
          >
            {item.name}
          </Link>
        ) : (
          <span className='text-neutral-700 dark:text-neutral-300'>
            {item.name}
          </span>
        )}
        {hasSubmenu && (
          <button
            onClick={() => setOpen(!open)}
            className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800'
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                open ? 'rotate-90' : ''
              }`}
            />
          </button>
        )}
      </div>
      {hasSubmenu && open && (
        <div
          className='ml-4 space-y-1 border-l border-gray-200 dark:border-neutral-700'
          style={{ marginLeft: depth * 8 + 16 }}
        >
          {item.submenu?.map((subItem) => (
            <MobileNavItem
              key={subItem.name}
              item={subItem}
              depth={depth + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      href='/'
      className='relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal'
    >
      <img
        src='https://assets.aceternity.com/logo-dark.png'
        alt='logo'
        width={30}
        height={30}
        className='dark:hidden'
      />
      <img
        src='https://assets.aceternity.com/logo-light.png'
        alt='logo'
        width={30}
        height={30}
        className='hidden dark:block'
      />
      <span className='font-medium text-black dark:text-white'>Startup</span>
    </Link>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = 'a',
  children,
  className,
  variant = 'primary',
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'gradient';
} & (
  | React.ComponentPropsWithoutRef<'a'>
  | React.ComponentPropsWithoutRef<'button'>
)) => {
  const baseStyles =
    'px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center';

  const variantStyles = {
    primary:
      'bg-white text-black shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]',
    secondary: 'bg-transparent text-black dark:text-white shadow-none',
    dark: 'bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]',
    gradient:
      'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]',
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
function Dropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className='relative'
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={item.link || '#'}
        className='px-4 py-2 inline-block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
      >
        {item.name}
      </Link>

      {item.submenu && open && (
        <div className='absolute left-0 top-full mt-1 z-50 animate-in fade-in zoom-in-95'>
          <ul className='min-w-[220px] space-y-1 p-2 bg-white/90 backdrop-blur-sm dark:bg-neutral-950/90 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800'>
            {item.submenu.map((subItem) => (
              <li key={subItem.name} className='relative group/item'>
                {subItem.submenu ? (
                  <>
                    <Link
                      href={subItem.link || '#'}
                      className='flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors'
                    >
                      {subItem.name}
                      <ChevronRight className='ml-2 h-4 w-4 opacity-70' />
                    </Link>
                    <div className='absolute left-full top-0 hidden min-w-[220px] group-hover/item:block bg-white/90 dark:bg-neutral-900/90 p-2 rounded-r-md shadow-lg ml-[-1px] border-l border-gray-200 dark:border-neutral-700'>
                      {subItem.submenu.map((subSubItem) => (
                        <Link
                          key={subSubItem.name}
                          href={subSubItem.link || '#'}
                          className='block px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors'
                        >
                          {subSubItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={subItem.link || '#'}
                    className='block px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors'
                  >
                    {subItem.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export const NavItems = ({ items }: { items: NavItem[] }) => {
  return (
    <div className='hidden lg:flex space-x-2'>
      {items.map((item) => (
        <Dropdown key={item.name} item={item} />
      ))}
    </div>
  );
};

// export const NavItems = ({ items }: { items: NavItem[] }) => {
//   return (
//     <div className='hidden lg:flex space-x-2'>
//       {items.map((item) => (
//         <div key={item.name} className='relative group'>
//           {item.submenu ? (
//             <>
//               <button className='px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
//                 {item.name}
//               </button>
//               <div className='absolute left-0 top-full mt-1 hidden group-hover:block animate-in fade-in zoom-in-95 z-50'>
//                 <ul className='min-w-[220px] space-y-1 p-2 bg-white/90 backdrop-blur-sm dark:bg-neutral-950/90 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-800'>
//                   {item.submenu.map((subItem) => (
//                     <li key={subItem.name} className='relative group/item'>
//                       {subItem.submenu ? (
//                         <>
//                           <div className='flex items-center justify-between px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors'>
//                             {subItem.name}
//                             <ChevronRight className='ml-2 h-4 w-4 opacity-70' />
//                           </div>
//                           <div className='absolute left-full top-0 hidden min-w-[220px] group-hover/item:block bg-white/90 dark:bg-neutral-900/90 p-2 rounded-r-md shadow-lg ml-[-1px] border-l border-gray-200 dark:border-neutral-700'>
//                             {subItem.submenu.map((subSubItem) => (
//                               <Link
//                                 key={subSubItem.name}
//                                 href={subSubItem.link || '#'}
//                                 className='block px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors'
//                               >
//                                 {subSubItem.name}
//                               </Link>
//                             ))}
//                           </div>
//                         </>
//                       ) : (
//                         <Link
//                           href={subItem.link || '#'}
//                           className='block px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors'
//                         >
//                           {subItem.name}
//                         </Link>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </>
//           ) : (
//             <Link
//               href={item.link || '#'}
//               className='px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
//             >
//               {item.name}
//             </Link>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// Example usage:
/*
const navItems = [
  {
    name: 'Solutions',
    submenu: [
      {
        name: 'Products',
        submenu: [
          { name: 'Wisdomic AI', link: '/products/wisdomic-ai' },
          { name: 'Analytics Pro', link: '/products/analytics-pro' },
        ],
      },
      {
        name: 'Services',
        submenu: [
          { name: 'AI Agent', link: '/services/ai-agent' },
          { name: 'AI SaaS', link: '/services/ai-saas' },
        ],
      },
    ],
  },
  {
    name: 'Resources',
    link: '/resources',
    submenu: [
      { name: 'Documentation', link: '/docs' },
      { name: 'Tutorials', link: '/tutorials' },
    ],
  },
  { name: 'Pricing', link: '/pricing' },
];

<Navbar>
  <NavBody>
    <NavbarLogo />
    <NavItems items={navItems} />
    <NavbarButton href="/contact">Contact Us</NavbarButton>
  </NavBody>
  
  <MobileNav>
    <MobileNavHeader>
      <NavbarLogo />
      <MobileNavToggle />
    </MobileNavHeader>
    <MobileNavMenu items={navItems} />
  </MobileNav>
</Navbar>
*/

import {
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Phone,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerLinks = {
    'Quick Links': ['Home', 'Services', 'About Us', 'Portfolio', 'Contact'],
    Services: [
      'AI Solutions',
      'Web Development',
      'Mobile Apps',
      'Digital Marketing',
      'UI/UX Design',
    ],
    'Contact Us': [
      ' 123 Tech Street,London, UK',
      '+44 20 1234 5678',
      'chat@xlab.vc',
    ],
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/arklabai',
      icon: Linkedin,
    },
    {
      name: 'Twitter',
      href: 'https://x.com/Arklab_AI',
      icon: Twitter,
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@ArklabAI',
      icon: Youtube,
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/arklabai',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/arklab.ai/',
      icon: Instagram,
    },
  ];

  return (
    <footer className='bg-gray-900 dark:bg-gray-950 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
          {/* Brand */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex items-center space-x-3'>
              <div className='p-2  rounded-lg'>
                {/* <div className='p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg'> */}
                <Image
                  src='/arklab-icon-modified.png'
                  alt='Arklab Logo'
                  width={30}
                  height={30}
                  className='h-8 w-8 object-contain'
                />
                {/* <Brain className='h-8 w-8 text-white' /> */}
              </div>
              <span className='text-2xl font-bold font-space-grotesk text-black dark:text-white whitespace-nowrap'>
                X<span className=' text-[#a855f7]'>LAB</span>
              </span>
            </div>
            <p className='text-gray-300 dark:text-gray-400 leading-relaxed max-w-md'>
              XLAB - Global AI Agency. Transforming businesses through
              cutting-edge artificial intelligence solutions. We make AI
              accessible, ethical, and impactful for organizations of all sizes.
            </p>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3 text-gray-300 dark:text-gray-400'>
                <Mail className='h-5 w-5 text-purple-400' />
                <span>team@arklabai.com</span>
              </div>
              <div className='pt-2'>
                <p className='text-sm text-gray-400 mb-3'>Follow us</p>
                <div className='flex space-x-4'>
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group'
                        aria-label={`Follow us on ${social.name}`}
                      >
                        <IconComponent className='h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200' />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className='text-lg font-semibold mb-4 text-white'>
                {category}
              </h3>
              <ul className='space-y-3'>
                {links.map((link) => {
                  // Add icons only for Contact Us section
                  if (category === 'Contact Us') {
                    if (link.includes('@')) {
                      return (
                        <li key={link} className='flex items-center space-x-2'>
                          <Mail className='h-5 w-5 text-purple-400' />
                          <span className='text-gray-300 dark:text-gray-400'>
                            {link}
                          </span>
                        </li>
                      );
                    }
                    if (link.match(/^\+\d/)) {
                      return (
                        <li key={link} className='flex items-center space-x-2'>
                          <Phone className='h-5 w-5 text-purple-400' />
                          <span className='text-gray-300 dark:text-gray-400'>
                            {link}
                          </span>
                        </li>
                      );
                    }
                    return (
                      <li key={link} className='flex items-center space-x-2'>
                        <span className='text-gray-300 dark:text-gray-400'>
                          {link}
                        </span>
                      </li>
                    );
                  }

                  // Normal link for other categories
                  return (
                    <li key={link}>
                      <a
                        href='#'
                        className='text-gray-300 dark:text-gray-400 hover:text-purple-400 transition-colors duration-200'
                      >
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 dark:border-gray-700 mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <p className='text-gray-400 dark:text-gray-500 text-sm'>
              © {currentYear} XLAB inc. All rights reserved.
            </p>
            <div className='flex space-x-6 text-sm text-gray-400 dark:text-gray-500'>
              <a
                href='/privacy'
                className='hover:text-purple-400 transition-colors duration-200'
              >
                Privacy Policy
              </a>
              <Link
                href='/terms'
                className='hover:text-purple-400 transition-colors duration-200'
              >
                Terms of Service
              </Link>
              <Link
                href='/cookies'
                className='hover:text-purple-400 transition-colors duration-200'
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

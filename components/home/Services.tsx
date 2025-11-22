import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Brain,
  MessageSquare,
  Bot,
  Settings,
  Headphones,
  Users,
  ArrowRight,
  Sparkles,
  Check,
  Star,
  ShoppingCart,
  Smartphone,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

export default function Services() {
  const services = [
    {
      icon: Bot,
      title: 'AI Agents',
      description:
        'Fully automate your tasks from start to finish with our advanced autonomous AI agent systems that work 24/7.',
      features: [
        'AI Chat & Voice Agents',
        'Social Media Automation',
        'Discord & Telegram Bot Development',
        'Custom GPT Models & Fine-Tuning',
        'Multi-Platform Content Scheduling & Outreach',
        'Engagement Analytics & Bot Performance Tracking',
      ],
      gradient: 'from-blue-600 via-purple-600 to-cyan-500',
      bgGradient: 'from-blue-50/50 via-purple-50/30 to-cyan-50/50',
      darkBgGradient: 'from-blue-950/20 via-purple-950/20 to-cyan-950/20',
      iconBg: 'from-blue-500 to-purple-600',
      accentColor: 'blue',
      pattern: 'dots',
      buttonHover: 'hover:from-blue-600 hover:via-purple-600 hover:to-cyan-500',
    },
    {
      icon: Brain,
      title: 'SaaS',
      description:
        'Build powerful software-as-a-service platforms with scalable architecture, subscription management, and integrated AI capabilities.',
      features: [
        'SaaS Architecture & Development',
        'Subscription & Billing Systems',
        'Multi-Tenant Applications',
        'User Management & Authentication',
        'API Development & Integration',
        'Cloud Deployment & Scalability',
      ],
      gradient: 'from-green-600 via-teal-600 to-emerald-500',
      bgGradient: 'from-green-50/50 via-teal-50/30 to-emerald-50/50',
      darkBgGradient: 'from-green-950/20 via-teal-950/20 to-emerald-950/20',
      iconBg: 'from-green-500 to-teal-600',
      accentColor: 'green',
      pattern: 'grid',
      buttonHover:
        'hover:from-green-600 hover:via-teal-600 hover:to-emerald-500',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description:
        'Create seamless online shopping experiences with AI-powered product recommendations, inventory management, and checkout systems.',
      features: [
        'E-commerce Platform Development',
        'Payment Gateway Integration',
        'Inventory Management Systems',
        'AI Product Recommendations',
        'Order Processing & Fulfillment',
        'Customer Analytics & Personalization',
      ],
      gradient: 'from-purple-600 via-pink-600 to-rose-500',
      bgGradient: 'from-purple-50/50 via-pink-50/30 to-rose-50/50',
      darkBgGradient: 'from-purple-950/20 via-pink-950/20 to-rose-950/20',
      iconBg: 'from-purple-500 to-pink-600',
      accentColor: 'purple',
      pattern: 'waves',
      buttonHover: 'hover:from-purple-600 hover:via-pink-600 hover:to-rose-500',
    },
    {
      icon: Smartphone,
      title: 'Apps',
      description:
        'Develop cross-platform mobile and web applications with intuitive UI/UX, native performance, and AI integration.',
      features: [
        'Mobile App Development (iOS & Android)',
        'Progressive Web Apps (PWA)',
        'Cross-Platform Development',
        'UI/UX Design & Optimization',
        'App Store Deployment',
        'Performance Monitoring & Analytics',
      ],
      gradient: 'from-indigo-600 via-blue-600 to-cyan-500',
      bgGradient: 'from-indigo-50/50 via-blue-50/30 to-cyan-50/50',
      darkBgGradient: 'from-indigo-950/20 via-blue-950/20 to-cyan-950/20',
      iconBg: 'from-indigo-500 to-blue-600',
      accentColor: 'indigo',
      pattern: 'dots',
      buttonHover: 'hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-500',
    },
    {
      icon: Rocket,
      title: 'MVP',
      description:
        'Quickly validate your business idea with a minimum viable product that focuses on core features and rapid market testing.',
      features: [
        'Rapid Prototyping',
        'Core Feature Development',
        'User Feedback Integration',
        'Market Validation Testing',
        'Scalability Planning',
        'Investor-Ready Presentations',
      ],
      gradient: 'from-orange-600 via-amber-600 to-yellow-500',
      bgGradient: 'from-orange-50/50 via-amber-50/30 to-yellow-50/50',
      darkBgGradient: 'from-orange-950/20 via-amber-950/20 to-yellow-950/20',
      iconBg: 'from-orange-500 to-amber-600',
      accentColor: 'orange',
      pattern: 'grid',
      buttonHover:
        'hover:from-orange-600 hover:via-amber-600 hover:to-yellow-500',
    },
    {
      icon: Settings,
      title: 'AI Consulting',
      description:
        'Comprehensive support to integrate AI into your existing systems or develop custom solutions tailored to your business.',
      features: [
        'AI Strategy Planning & Implementation',
        'System Integration & Multi-App Connectivity',
        'Workflow Automation for Operational Efficiency',
        'Employee Training & Performance Enablement',
        '24/7 Tech Support with Real-Time Monitoring',
        'Continuous Updates, Bug Fixes & Scalability Planning',
      ],
      gradient: 'from-red-600 via-pink-600 to-rose-500',
      bgGradient: 'from-red-50/50 via-pink-50/30 to-rose-50/50',
      darkBgGradient: 'from-red-950/20 via-pink-950/20 to-rose-950/20',
      iconBg: 'from-red-500 to-pink-600',
      accentColor: 'red',
      pattern: 'waves',
      buttonHover: 'hover:from-red-600 hover:via-pink-600 hover:to-rose-500',
    },
  ];

  return (
    <section id='services' className='py-24 bg-white dark:bg-[#15082F] '>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center space-y-6 mb-16'>
          <div className='inline-flex items-center px-4 py-2 bg-purple-50 dark:bg-purple-900/50 rounded-full'>
            <Sparkles className='h-4 w-4 text-purple-600 dark:text-purple-400 mr-2' />
            <span className='text-sm font-semibold text-purple-800 dark:text-purple-300'>
              Our Services
            </span>
          </div>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold'>
            <span className='bg-gradient-to-r from-gray-900 to-purple-800 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent'>
              Comprehensive AI Solutions
            </span>
          </h2>
          <p className='max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
            We combine technical expertise with creative thinking to deliver
            exceptional digital solutions.
          </p>
        </div>

        {/* Services Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className={`group relative flex flex-col justify-between h-full overflow-hidden border-0 dark:border-0 shadow-md bg-white/80 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer`}
              >
                {/* Top content */}
                <div className='p-4 space-y-4'>
                  <CardHeader className='space-y-2 p-0'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-gradient-to-br ${service.iconBg} shadow`}
                      >
                        <Icon className='h-6 w-6 text-white' />
                      </div>
                      <CardTitle className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                        {service.title}
                      </CardTitle>
                    </div>
                    <CardDescription className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='p-0 mt-4'>
                    <ul className='space-y-2 text-sm'>
                      {service.features.map((feature, idx) => (
                        <li key={idx} className='flex items-center gap-2'>
                          <Check
                            className={`w-4 h-4 text-white bg-gradient-to-br ${service.iconBg} rounded-full p-0.5`}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                {/* Button always at the bottom */}
                <div className='p-4'>
                  <Link href='/contact'>
                    <Button
                      variant='outline'
                      className={`w-full group/btn relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-transparent bg-white dark:bg-gray-800 hover:bg-gradient-to-r  hover:text-white font-semibold py-3 transition-all duration-300 hover:shadow-lg hover:shadow-${service.accentColor}-500/25  hover:shadow-lg ${service.buttonHover} `}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className='text-center mt-16'>
          {' '}
          <p className='text-gray-600 dark:text-gray-400 mb-6'>
            Don&apos;t see what you&apos;re looking for? We create custom AI
            solutions tailored to your unique needs.
          </p>
          <Link href={'/contact'}>
            <Button
              size='lg'
              className='bg-gradient-to-r cursor-pointer from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white px-8 py-4'
            >
              Discuss Custom Solutions
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

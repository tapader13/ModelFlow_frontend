import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Award,
  Globe,
  Lightbulb,
  Target,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  QuoteIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navigation from '@/components/header/Navigation';
import Footer from '@/components/footer/Footer';

export default function AboutPage() {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description:
        "We push the boundaries of what's possible with AI, constantly exploring new technologies and methodologies to deliver cutting-edge solutions.",
    },
    {
      icon: Target,
      title: 'Excellence',
      description:
        'Every solution we deliver meets the highest standards of quality, performance, and reliability. We never compromise on excellence.',
    },
    {
      icon: Heart,
      title: 'Partnership',
      description:
        'We work closely with our clients as trusted partners, ensuring their success is our success through collaborative relationships.',
    },
    {
      icon: Shield,
      title: 'Trust',
      description:
        'We build secure, ethical AI solutions that respect privacy and maintain the highest standards of data protection and compliance.',
    },
    {
      icon: Zap,
      title: 'Agility',
      description:
        'We adapt quickly to changing requirements and market conditions, delivering solutions that evolve with your business needs.',
    },
    {
      icon: TrendingUp,
      title: 'Growth',
      description:
        'We focus on solutions that drive sustainable growth and long-term value for our clients and their stakeholders.',
    },
  ];

  const stats = [
    { number: '10+', label: 'AI Experts', icon: Users },
    { number: '50+', label: 'Projects Completed', icon: Award },
    { number: '12+', label: 'Countries Served', icon: Globe },
    { number: '3+', label: 'Years Experience', icon: Sparkles },
  ];

  return (
    <main className='min-h-screen'>
      <Navigation />

      {/* Hero Section */}
      <section className='pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#091030] dark:via-[#091030] dark:to-[#091030]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-6 mb-16'>
            <div className='inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full border border-purple-200 dark:border-purple-700'>
              <Sparkles className='h-4 w-4 text-purple-600 dark:text-purple-400 mr-2' />
              <span className='text-sm font-semibold text-purple-800 dark:text-purple-300'>
                About Us
              </span>
            </div>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold'>
              <span className='bg-gradient-to-r from-gray-900 to-purple-800 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent'>
                Leading AI Innovation
              </span>
            </h1>
            <p className='max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed'>
              At Arklab AI, we&rsquo;re passionate about transforming businesses
              through artificial intelligence. Our team of world-class experts
              delivers cutting-edge solutions that drive real results.
            </p>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-20'>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className='text-center'>
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4'>
                    <Icon className='h-8 w-8 text-purple-600 dark:text-purple-400' />
                  </div>
                  <div className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    {stat.number}
                  </div>
                  <div className='text-gray-600 dark:text-gray-400 font-medium'>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='py-24 bg-white dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-16 items-center mb-20'>
            {/* Text Content */}
            <div className='space-y-8'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
                  Our Mission
                </h2>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed text-lg'>
                  To be the leading provider of AI-driven solutions,
                  revolutionizing the way businesses operate and achieve
                  success. We envision a future where every business, regardless
                  of size, leverages the power of artificial intelligence to
                  achieve unprecedented levels of productivity, innovation, and
                  growth.
                </p>
              </div>
              <div>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
                  Our Vision
                </h2>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed text-lg'>
                  Empowering businesses through innovative AI solutions to drive
                  growth, enhance efficiency, and unlock new opportunities. We
                  strive to deliver cutting-edge technology that transforms
                  operations and maximizes potential, enabling our clients to
                  thrive in a rapidly evolving digital landscape.
                </p>
              </div>
              <div>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
                  Our Approach
                </h2>
                <p className='text-gray-600 dark:text-gray-300 leading-relaxed text-lg'>
                  Every project begins with understanding your unique challenges
                  and goals. We combine cutting-edge technology with deep
                  industry expertise to deliver solutions that integrate
                  seamlessly into your existing workflows and drive measurable
                  impact.
                </p>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className='relative'>
              <div className='aspect-square bg-gradient-to-br from-[#170A35] to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center'>
                <div className='text-center text-white space-y-4'>
                  <div className='w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto'>
                    <Lightbulb className='w-12 h-12' />
                  </div>
                  <h4 className='text-2xl font-bold'>Innovation at Scale</h4>
                  <p className='text-blue-100 max-w-xs'>
                    Transforming ideas into intelligent solutions that power the
                    future
                  </p>
                </div>
              </div>
              {/* Floating Elements */}
              <div className='absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg'>
                <Sparkles className='w-12 h-12 text-yellow-800' />
              </div>
              <div className='absolute -bottom-6 -left-6 w-20 h-20 bg-teal-400 rounded-full flex items-center justify-center shadow-lg'>
                <Target className='w-10 h-10 text-teal-800' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#091030] dark:via-[#091030] dark:to-[#091030]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-6 mb-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold'>
              <span className='bg-gradient-to-r from-gray-900 to-purple-800 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent'>
                Our Core Values
              </span>
            </h2>
            <p className='max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
              These values guide everything we do and shape how we work with our
              clients and each other.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className='text-center border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 dark:border dark:border-gray-700'
                >
                  <CardContent className='p-8 space-y-4'>
                    <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#170A35] to-purple-600 rounded-2xl shadow-lg'>
                      <Icon className='h-8 w-8 text-white' />
                    </div>
                    <h4 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                      {value.title}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Testimonial Section */}
      <section className='py-24 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Quote Icon */}
          <div className='flex-shrink-0'>
            <svg
              aria-hidden='true'
              className='w-12 h-12 text-purple-600 dark:text-purple-400'
              viewBox='0 0 512 512'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill='currentColor'
                d='M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C359.6 32 288 103.6 288 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z'
              />
            </svg>
          </div>
          <div className='relative flex items-center gap-8  rounded-3xl p-10 '>
            {/* Vertical Line */}
            <div className='w-1 absolute bg-purple-600 dark:bg-purple-400 rounded-full  top-10 left-4 bottom-10 '></div>

            {/* Text Content */}
            <div className='flex-1 text-gray-700 dark:text-gray-200 space-y-4 ml-8'>
              <p className='text-lg font-semibold font-space-grotesk leading-relaxed text-justify'>
                “I was an indie app developer when my friend Abir Ahmed from JU
                Zoology told me about a story where AI had solved a protein
                folding problem, reducing the cost by a staggering 100x. Around
                the same time, ChatGPT was newly released, and as I was doing my
                boring university assignments, I realized just how powerful AI
                could be. Abir and I thought of starting an AI startup since it
                was an inflection point in the tech field.”
              </p>

              <p className='text-lg font-semibold font-space-grotesk leading-relaxed text-justify'>
                “We brainstormed a lot and decided to focus on providing basic
                healthcare to people through AI. However, we didn’t have any
                money, being just university students with no savings. My
                younger sister lent us 5000 Taka to buy API keys and servers.
                With that money, we bought API keys and used free servers to
                create a prototype, which we planned to present to Shark Tank
                Bangladesh. Our main goal was to impress the CEO of Startups
                Bangladesh to help us with regulations and funding.
                Unfortunately, we got rejected.”
              </p>

              <p className='text-lg font-semibold font-space-grotesk leading-relaxed text-justify'>
                “Despite this setback, we had a skill: the ability to build
                custom GPT solutions. So, we decided to provide custom GPT
                solutions to businesses. That’s how Arklab was born.”
              </p>
            </div>
          </div>
          {/* Author */}
          <div className='flex justify-end mt-3 space-x-4'>
            <div className='text-right'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                - Ovi
              </h3>
              <h5 className='text-sm font-semibold text-gray-400 dark:text-gray-300'>
                Co-Founder
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className='py-24 bg-white dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-6 mb-16'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold'>
              <span className='bg-gradient-to-r from-gray-900 to-purple-800 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent'>
                Why Choose <span className='text-black dark:text-white'>X</span>
                LAB?
              </span>
            </h2>
            <p className='max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
              We combine cutting-edge technology with industry expertise to
              deliver AI solutions that transform businesses.
            </p>
          </div>

          <div className='grid lg:grid-cols-2 gap-12 items-center mb-20'>
            {/* Left side - Key differentiators */}
            <div className='space-y-8'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                  <Zap className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    Lightning-Fast Implementation
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Get AI solutions up and running in under 24 hours with our
                    rapid deployment methodology and pre-built frameworks.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center'>
                  <Shield className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    Enterprise-Grade Security
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Built with security-first principles, our solutions meet the
                    highest standards for data protection and compliance.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center'>
                  <Users className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    24/7 Expert Support
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Our dedicated team of AI specialists provides
                    round-the-clock support to ensure your systems run smoothly.
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
                    Proven ROI Results
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300'>
                    Our clients see an average of 40% cost reduction and 300%
                    productivity increase within the first 6 months.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Success metrics */}
            <div className='bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-8 shadow-xl'>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center'>
                Success by the Numbers
              </h3>

              <div className='grid grid-cols-2 gap-6'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2'>
                    98%
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    Client Satisfaction
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2'>
                    40%
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    Average Cost Reduction
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-green-600 dark:text-green-400 mb-2'>
                    300%
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    Productivity Increase
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2'>
                    24h
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-300'>
                    Implementation Time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24 bg-gradient-to-r from-purple-600 to-purple-600'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
            Ready to Join Our Success Story?
          </h2>
          <p className='text-xl text-blue-100 mb-8 leading-relaxed'>
            Let&rsquo;s work together to transform your business with
            cutting-edge AI solutions.
          </p>
          <div className='flex justify-center'>
            <Link href='/contact'>
              <Button
                size='lg'
                variant='secondary'
                className='bg-white cursor-pointer text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold'
              >
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

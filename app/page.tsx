import Approach from '@/components/approach/Approach';
import Contact from '@/components/contact/Contact';
import Footer from '@/components/footer/Footer';
import Navigation from '@/components/header/Navigation';
import Hero from '@/components/hero/Hero';
import Trusted from '@/components/hero/Trusted';
import Services from '@/components/home/Services';
import Process from '@/components/process/Process';
import Projects from '@/components/projects/Projects';
import Reviews from '@/components/reviews/Reviews';

export default function Home() {
  return (
    <main className='min-h-screen '>
      <Navigation />
      <Hero />
      <Trusted />
      {/* <Services /> */}
      <Projects />
      {/* <Features /> */}
      <Process />
      <Approach />
      {/* <About /> */}
      {/* <Process />
      <FAQSection /> */}
      {/* <GlobalReachSection /> */}
      {/* <Calendly /> */}
      <Contact />
      {/* <Reviews /> */}

      <Footer />
      {/* <div>
        <WhatsAppButtonBottom />
      </div> */}
    </main>
  );
}

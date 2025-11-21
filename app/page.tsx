import Footer from '@/components/footer/Footer';
import Navigation from '@/components/header/Navigation';
import Hero from '@/components/hero/Hero';

export default function Home() {
  return (
    <main className='min-h-screen '>
      <Navigation />
      <Hero />
      {/* <Services />
      <Projects />
      <Features /> */}

      {/* <About /> */}
      {/* <Process />
      <FAQSection /> */}
      {/* <GlobalReachSection /> */}
      {/* <Calendly /> */}
      {/* <Contact />
      <Reviews /> */}

      <Footer />
      {/* <div>
        <WhatsAppButtonBottom />
      </div> */}
    </main>
  );
}

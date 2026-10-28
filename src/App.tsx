import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Hero } from './components/Hero';
import { ReservationSteps } from './components/ReservationSteps';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { IconSprite } from './components/Icons';
import { AboutSection } from './sections/AboutSection';
import { ToursSection } from './sections/ToursSection';
import { PrivateToursSection } from './sections/PrivateToursSection';
import { ExperiencesSection } from './sections/ExperiencesSection';
import { ContactSection } from './sections/ContactSection';
import { LagoonsSection } from './sections/LagoonsSection';
import { BookingDialog } from './components/booking/BookingDialog';
import { TripBar, TripCart } from './components/booking/TripCart';
import { useBooking } from './lib/booking';
import { initAnalytics } from './lib/analytics';
import { ConsentBanner } from './components/ConsentBanner';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useBooking();
  useEffect(() => initAnalytics(), []);

  return (
    <>
      <IconSprite />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="conteudo">
        <Hero />
        <AboutSection />
        <ToursSection />
        <PrivateToursSection />
        <ExperiencesSection />
        <LagoonsSection />
        <ReservationSteps />
        <FAQ />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton hidden={menuOpen || items.length > 0} />
      <TripBar hidden={menuOpen} />
      <BookingDialog />
      <TripCart />
      <ConsentBanner />
    </>
  );
}

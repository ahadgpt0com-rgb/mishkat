import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Countdown from '../components/Countdown';
import Story from '../components/Story';
import Events from '../components/Events';
import Gallery from '../components/Gallery';
import RSVP from '../components/RSVP';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import PinAuth from '../components/PinAuth';
import { getWebsiteConfig } from '../services/storage';
import { WebsiteConfig } from '../types';
import { Loader2 } from 'lucide-react';

const Home: React.FC = () => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const data = await getWebsiteConfig();
      setConfig(data);
    };
    fetchConfig();
  }, []);

  if (!config) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-wedding-bg">
        <Loader2 className="animate-spin text-wedding-primary" size={48} />
      </div>
    );
  }

  return (
    <PinAuth correctPin="1234">
      <div className="font-sans text-slate-800">
        <Navbar />
        <Hero data={config.hero} />
        <Countdown targetDateStr={config.countdownDate} />
        <Story stories={config.stories} />
        <Events events={config.events} />
        <Gallery photos={config.gallery} />
        <RSVP 
          groomName={config.hero.groomName} 
          brideName={config.hero.brideName} 
          date={config.hero.date} 
          location={config.hero.location}
        />
        <Contact contact={config.contact} />
        <Footer groomName={config.hero.groomName} brideName={config.hero.brideName} />
      </div>
    </PinAuth>
  );
};

export default Home;
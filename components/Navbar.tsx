
import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'হোম', id: 'home' },
    { name: 'আমাদের গল্প', id: 'couple' },
    { name: 'অনুষ্ঠান', id: 'events' },
    { name: 'গ্যালারি', id: 'gallery' },
    { name: 'RSVP', id: 'rsvp' },
    { name: 'যোগাযোগ', id: 'contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled || !isHome || isOpen
      ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
      : 'bg-transparent py-4'
  }`;

  const textClass = scrolled || !isHome || isOpen ? 'text-slate-800' : 'text-white';
  const logoClass = scrolled || !isHome || isOpen ? 'text-wedding-primary' : 'text-white';

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 cursor-pointer flex items-center gap-2 group" onClick={() => handleNavClick('home')}>
             <div className="relative">
                <Heart className={`fill-current ${logoClass} transition-colors duration-300`} size={28} />
                <Heart className={`absolute top-0 left-0 fill-current ${logoClass} animate-ping opacity-30`} size={28} />
             </div>
             <span className={`text-3xl font-cursive font-bold ${logoClass} transition-colors duration-300`}>
              শুভ বিবাহ
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-5 -mt-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.id)}
                  className={`${textClass} hover:text-wedding-primary px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-white/20`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className={`p-2 rounded-md ${textClass} hover:text-wedding-primary focus:outline-none`}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-t transition-all duration-300 origin-top ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-2 text-center shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.id)}
              className="text-slate-800 hover:text-wedding-primary hover:bg-rose-50 block w-full px-3 py-3 rounded-xl text-lg font-medium transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

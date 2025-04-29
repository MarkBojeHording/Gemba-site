import React, { useState, useEffect } from 'react';
import { Menu, X, Briefcase } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav id="navbar">
      <div className="navbar-flex">
        <div className="navbar-left">
          <a href="index.html" className="logo">
            <img src="images/LOGO_white.png" alt="Gemba Indonesia Karya Logo" className="logo-image" />
          </a>
        </div>
        <div className="navbar-center">
          <span className="navbar-title">Gemba Indonesia Karya</span>
        </div>
        <div className="navbar-right">
          <div className="nav-links" id="navLinks">
            <a href="index.html#home">Home</a>
            <a href="index.html#about">About</a>
            <div className="dropdown">
              <a href="index.html#services" className="dropdown-toggle">Services</a>
              <div className="dropdown-menu">
                {/* ... */}
              </div>
            </div>
            <a href="index.html#contact">Contact</a>
          </div>
          <button className="menu-toggle" id="menuToggle">
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </button>
        </div>
      </div>
      {/* Mobile menu here */}
      {isMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-md animate-fade-in">
          <div className="container mx-auto px-4 py-4">
            {['Home', 'About', 'Services', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2 text-gemba hover:text-gemba-secondary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

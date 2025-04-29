
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gemba text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Gemba Indonesia Karya</h3>
            <p className="text-gray-300 mb-4">
            Unleashing Your Potential, Empowering Your Future.
            <p>Gemba Indonesia Karya will work with you to unleash your full potential, elevating your business to new heights of performance, collaboration, and customer success.</p>
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gemba-secondary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-gemba-secondary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-gemba-secondary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-gemba-secondary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter to receive updates on our services and industry insights.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md focus:outline-none flex-1 text-gemba"
              />
              <button
                type="submit"
                className="bg-gemba-secondary text-gemba px-4 py-2 rounded-r-md font-medium hover:bg-yellow-500 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; {currentYear} Gemba Indonesia Karya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

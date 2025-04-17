
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero-section min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Transforming Businesses Through Expert Consulting
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Gemba Indonesia Karya provides top-tier consulting services to help your business achieve operational excellence and sustainable growth
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a 
              href="#services" 
              className="bg-gemba-secondary hover:bg-yellow-500 text-gemba font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              Our Services <ArrowRight size={18} />
            </a>
            <a 
              href="#contact" 
              className="border-2 border-white text-white hover:bg-white hover:text-gemba font-bold py-3 px-6 rounded-md transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

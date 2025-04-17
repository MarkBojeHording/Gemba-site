
import React from 'react';
import { Award, TrendingUp, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gemba mb-4">About Gemba Indonesia Karya</h2>
          <div className="w-20 h-1 bg-gemba-secondary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-gemba mb-4">Who We Are</h3>
            <p className="text-gray-700 mb-6">
              Gemba Indonesia Karya is a premier consulting firm dedicated to helping businesses achieve operational excellence. 
              Our team of seasoned professionals brings decades of experience across various industries, 
              providing practical solutions tailored to your unique business challenges.
            </p>
            <p className="text-gray-700 mb-6">
              We believe in the principle of "Gemba" - the real place where value is created. 
              Our approach focuses on going to the source, understanding your operations firsthand, 
              and implementing practical, effective solutions that drive measurable results.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="flex flex-col items-center">
                <div className="text-gemba-secondary font-bold text-4xl">10+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gemba-secondary font-bold text-4xl">200+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-gemba-secondary font-bold text-4xl">50+</div>
                <div className="text-gray-600">Expert Consultants</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gemba-light p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-gemba rounded-full p-3 mr-4">
                  <Award className="text-white h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gemba mb-2">Industry Expertise</h4>
                  <p className="text-gray-700">
                    Our consultants bring specialized knowledge across manufacturing, supply chain, 
                    healthcare, financial services, and technology sectors.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gemba-light p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-gemba rounded-full p-3 mr-4">
                  <TrendingUp className="text-white h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gemba mb-2">Results-Driven Approach</h4>
                  <p className="text-gray-700">
                    We focus on delivering measurable outcomes that directly impact your bottom line
                    through practical, implementable solutions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gemba-light p-6 rounded-lg">
              <div className="flex items-start">
                <div className="bg-gemba rounded-full p-3 mr-4">
                  <Users className="text-white h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gemba mb-2">Client Partnership</h4>
                  <p className="text-gray-700">
                    We work alongside your team, transferring knowledge and building capabilities
                    to ensure sustainable success long after our engagement ends.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

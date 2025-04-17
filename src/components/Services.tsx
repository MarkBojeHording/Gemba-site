
import React from 'react';
import { BarChart3, BookOpen, Briefcase, Lightbulb, LineChart, Settings } from 'lucide-react';

const serviceItems = [
  {
    icon: <Briefcase className="service-icon" />,
    title: "Business Strategy",
    description: "Develop comprehensive business strategies aligned with your long-term vision and market opportunities."
  },
  {
    icon: <BarChart3 className="service-icon" />,
    title: "Operational Excellence",
    description: "Optimize your operations through lean management practices, reducing waste and maximizing efficiency."
  },
  {
    icon: <Settings className="service-icon" />,
    title: "Process Optimization",
    description: "Identify bottlenecks and streamline processes to improve productivity and quality across your organization."
  },
  {
    icon: <LineChart className="service-icon" />,
    title: "Financial Analysis",
    description: "In-depth financial assessments to identify opportunities for cost reduction and profit improvement."
  },
  {
    icon: <BookOpen className="service-icon" />,
    title: "Training & Development",
    description: "Custom training programs to build capabilities within your team, ensuring sustainable performance."
  },
  {
    icon: <Lightbulb className="service-icon" />,
    title: "Innovation Management",
    description: "Implement frameworks to cultivate innovation and bring new ideas to market efficiently."
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gemba mb-4">Our Services</h2>
          <div className="w-20 h-1 bg-gemba-secondary mx-auto mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We offer comprehensive consulting services designed to drive meaningful business transformation. 
            Our expert team delivers customized solutions tailored to your specific challenges.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => (
            <div 
              key={index} 
              className="service-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-start">
                {service.icon}
                <h3 className="text-xl font-semibold text-gemba mb-3">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

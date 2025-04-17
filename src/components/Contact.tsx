
import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage('Thank you for your message. We will get back to you soon!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gemba mb-4">Contact Us</h2>
          <div className="w-20 h-1 bg-gemba-secondary mx-auto mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Have questions about our services or want to discuss how we can help your business?
            Get in touch with our team of experts today.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-gemba mb-6">Get In Touch</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gemba"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gemba"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gemba"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gemba"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gemba hover:bg-gemba-dark text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitMessage && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-gemba mb-6">Contact Information</h3>
            
            <div className="bg-gemba-light p-8 rounded-lg">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gemba rounded-full p-3 mr-4">
                    <MapPin className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gemba mb-1">Our Office</h4>
                    <p className="text-gray-700">Jakarta, Indonesia</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gemba rounded-full p-3 mr-4">
                    <Mail className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gemba mb-1">Email Us</h4>
                    <p className="text-gray-700">info@gembaindonesia.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gemba rounded-full p-3 mr-4">
                    <Phone className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gemba mb-1">Call Us</h4>
                    <p className="text-gray-700">+62 21 1234 5678</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gemba mb-3">Business Hours</h4>
                <div className="space-y-2 text-gray-700">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

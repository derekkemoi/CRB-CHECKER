import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Shield,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ArrowRight,
  MessageSquare,
  Rocket,
  CheckCircle,
  LightbulbIcon,
  Send,
  Menu,
  X
} from 'lucide-react';
import { testimonials, faqs, features } from './data';

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const itemWidth = isMobile ? window.innerWidth - 32 : 400;
  const visibleItems = isMobile ? 1 : 3;
  const totalTestimonials = testimonials.length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollTo = useCallback((direction: 'prev' | 'next') => {
    setAutoScroll(false);
    setCurrentTestimonial(prev => {
      if (direction === 'prev') {
        return prev === 0 ? totalTestimonials - 1 : prev - 1;
      } else {
        return prev === totalTestimonials - 1 ? 0 : prev + 1;
      }
    });
  }, [totalTestimonials]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScroll) {
      interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev === totalTestimonials - 1 ? 0 : prev + 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoScroll, totalTestimonials]);

  const scrollPosition = currentTestimonial * itemWidth - (itemWidth * (visibleItems - 1) / 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8" />
              <span className="text-2xl font-bold">CRB Check</span>
            </div>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-blue-200 transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-blue-200 transition-colors">Reviews</a>
              <a href="#faq" className="hover:text-blue-200 transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-blue-200 transition-colors">Contact</a>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link 
                to="/signin" 
                className="px-4 py-2 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <div 
            className={`md:hidden absolute left-0 right-0 top-full bg-blue-800 shadow-lg transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <div className="px-4 py-4 space-y-4">
              <div className="space-y-2">
                <a 
                  href="#features" 
                  className="block py-2 hover:bg-blue-700 px-4 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Features
                </a>
                <a 
                  href="#testimonials" 
                  className="block py-2 hover:bg-blue-700 px-4 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Reviews
                </a>
                <a 
                  href="#faq" 
                  className="block py-2 hover:bg-blue-700 px-4 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  FAQ
                </a>
                <a 
                  href="#contact" 
                  className="block py-2 hover:bg-blue-700 px-4 rounded-lg transition-colors"
                  onClick={closeMobileMenu}
                >
                  Contact
                </a>
              </div>
              <div className="pt-4 border-t border-blue-700 space-y-2">
                <Link 
                  to="/signin"
                  className="block w-full px-4 py-2 text-center text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="block w-full px-4 py-2 text-center bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Check Your Credit Report with Confidence
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Get instant access to your credit report and score. Make informed financial decisions with our comprehensive credit monitoring service.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                  href="#features"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  Explore Features
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
                <Link 
                  to="/signup"
                  className="px-8 py-4 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors flex items-center justify-center"
                >
                  Start Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" 
                alt="Credit Report Analysis" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Our Service?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link 
              to="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Begin Your Journey
              <Rocket className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Client Reviews</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${scrollPosition}px)`,
                  width: `${testimonials.length * itemWidth}px`
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className={`${isMobile ? 'w-[calc(100vw-32px)]' : 'w-[400px]'} p-4 transition-opacity duration-300 ${
                      index === currentTestimonial ? 'opacity-100' : 'opacity-70'
                    }`}
                    style={{ width: itemWidth }}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg h-auto md:h-[280px] flex flex-col">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-gray-600 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 flex-grow text-sm md:text-base">{testimonial.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6 md:hidden space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => scrollTo('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => scrollTo('next')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
          <div className="mt-12 text-center">
            <Link 
              to="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Join Our Success Stories
              <CheckCircle className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link 
              to="/signup"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Take Control Today
              <LightbulbIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg text-gray-600">
                Have questions about your credit report? Our team is here to help.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-300"
                      placeholder="John"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-300"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-300 resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center group"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8" />
                <span className="text-2xl font-bold">CRB Check</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner in credit reporting and monitoring.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Reviews</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  +254 (20) 123-4567
                </li>
                <li className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  support@crbcheck.co.ke
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  Westlands Business Park<br />Nairobi, Kenya
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CRB Check. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home
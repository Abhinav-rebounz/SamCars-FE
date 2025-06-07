import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ThumbsUp, Clock } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg')",
            backgroundBlendMode: "overlay"
          }}
        ></div>
        <div className="container-custom relative z-10 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Sam Cars
            </h1>
            <p className="text-xl mb-8">
              Your trusted partner for all your automotive needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="btn-secondary">
                Our Services
              </Link>
              <Link to="/contact" className="bg-white text-blue-700 hover:bg-gray-100 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Why Choose Sam Cars</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and value to our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <ThumbsUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
              <p className="text-gray-600">
                Our expert technicians provide top-notch service for all your automotive needs.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Warranty</h3>
              <p className="text-gray-600">
                All our services come with warranty for your peace of mind.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Process</h3>
              <p className="text-gray-600">
                Clear pricing and detailed service reports for all our work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">John D.</h4>
                  <div className="flex text-amber-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Excellent service! The team was professional and got my car fixed quickly."
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah M.</h4>
                  <div className="flex text-amber-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Very happy with the service. Fair prices and great customer service!"
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  R
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert K.</h4>
                  <div className="flex text-amber-400">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The team at Sam Cars is knowledgeable and trustworthy. Highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
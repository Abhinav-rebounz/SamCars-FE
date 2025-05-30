import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Saam Cars LLC</span>
            </div>
            <p className="text-gray-300 mb-4">
              Specializing in high-quality pre-owned vehicles at affordable prices. Your trusted partner in finding the perfect car.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400">Home</Link>
              </li>
              <li>
                <Link to="/inventory" className="text-gray-300 hover:text-blue-400">Inventory</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-blue-400">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400">Contact Us</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-blue-400">Login</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Vehicle Sales</li>
              <li className="text-gray-300">Vehicle Maintenance</li>
              <li className="text-gray-300">Trade-In Appraisals</li>
              <li className="text-gray-300">Extended Warranties</li>
              <li className="text-gray-300">Vehicle Inspection</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-300">123 Auto Drive, Cartown, CT 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">info@saamcars.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Business Hours:</h4>
              <p className="text-gray-300">Mon-Fri: 9:00 AM - 7:00 PM</p>
              <p className="text-gray-300">Saturday: 10:00 AM - 5:00 PM</p>
              <p className="text-gray-300">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Saam Cars LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
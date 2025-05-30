import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to the server
    setFormSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-xl mb-0">
              Have questions or need assistance? We're here to help!
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">Sales Department</p>
              <a href="tel:5551234567" className="text-blue-700 font-medium">(555) 123-4567</a>
              <p className="text-gray-600 mt-2 mb-2">Service Department</p>
              <a href="tel:5557654321" className="text-blue-700 font-medium">(555) 765-4321</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600 mb-2">General Inquiries</p>
              <a href="mailto:info@samcars.com" className="text-blue-700 font-medium">info@samcars.com</a>
              <p className="text-gray-600 mt-2 mb-2">Service Department</p>
              <a href="mailto:service@samcars.com" className="text-blue-700 font-medium">service@samcars.com</a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-600 mb-2">Main Dealership</p>
              <p className="text-gray-800">123 Auto Drive</p>
              <p className="text-gray-800">Cartown, CT 12345</p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-700 font-medium inline-block mt-2"
              >
                Get Directions
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
              <div className="text-gray-600">
                <p className="mb-1"><span className="font-medium">Mon-Fri:</span> 9:00 AM - 7:00 PM</p>
                <p className="mb-1"><span className="font-medium">Saturday:</span> 10:00 AM - 5:00 PM</p>
                <p><span className="font-medium">Sunday:</span> Closed</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              
              {formSubmitted ? (
                <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                  <h3 className="font-semibold mb-1">Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      >
                        <option value="">Select a subject</option>
                        <option value="Sales Inquiry">Sales Inquiry</option>
                        <option value="Service Appointment">Service Appointment</option>
                        <option value="Parts Inquiry">Parts Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary">
                    Send Message
                  </button>
                </form>
              )}
            </div>
            
            {/* Map */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6">Our Location</h2>
              <div className="aspect-w-16 aspect-h-9 h-80 bg-gray-200 rounded-md overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573036935!2d-73.98784492404045!3d40.75798833440232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1696374292267!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sam Cars Location"
                ></iframe>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Directions</h3>
                <p className="text-gray-600 mb-4">
                  We're conveniently located in downtown Cartown, just off the main highway. Look for the blue and silver building with the Sam Cars sign.
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">From Highway 101:</p>
                      <p className="text-gray-600">Take exit 25, turn right on Auto Drive. We're 0.5 miles on the left.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">From Downtown:</p>
                      <p className="text-gray-600">Head north on Main Street, turn left on Auto Drive. We're 0.2 miles on the right.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="heading-lg mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to our most commonly asked questions. If you don't see what you're looking for, please contact us.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Do you offer warranties on your vehicles?</h3>
                <p className="text-gray-600">
                  Yes, all our vehicles come with a limited warranty. We also offer extended warranty options for additional peace of mind. Our sales team can provide details specific to the vehicle you're interested in.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Can I schedule a test drive online?</h3>
                <p className="text-gray-600">
                  Yes, you can schedule a test drive through our website. Simply browse our inventory, select the vehicle you're interested in, and click the "Book Test Drive" button on the vehicle details page.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Do you buy vehicles from individuals?</h3>
                <p className="text-gray-600">
                  Yes, we purchase quality pre-owned vehicles. You can bring your vehicle to our dealership for an appraisal, or contact us to schedule an appointment. We offer competitive prices based on current market values.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">What documents do I need to purchase a vehicle?</h3>
                <p className="text-gray-600">
                  You'll need a valid driver's license, proof of insurance, and payment for the vehicle. Our team will guide you through any additional documentation required for your specific situation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
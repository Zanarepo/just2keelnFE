import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-lg p-10 text-gray-800 border-t mt-12">
      {/* Footer Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">About Just2Kleen</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Just2Kleen connects clients and service providers for efficient, affordable, and customized cleaning solutions, ensuring high-quality service and convenience for both.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <i className="fas fa-map-marker-alt mr-2"></i>
              123 Clean Street, Service City, 98765
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone-alt mr-2"></i>
              +1 (555) 123-4567
            </li>
            <li className="flex items-center">
              <i className="fas fa-envelope mr-2"></i>
              contact@just2kleen.com
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-gray-700">
            <a
              href="https://facebook.com"
              className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              className="p-3 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-all"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              className="p-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-all"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-all"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Links and Copyright */}
      <div className="mt-10 border-t pt-6 text-center">
        <div className="space-x-6 mb-4">
          <a href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600">
            Privacy Policy
          </a>
          <a href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
            Terms of Service
          </a>
        </div>
        <p className="text-xs text-gray-500">
          © 2025 Just2Kleen. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

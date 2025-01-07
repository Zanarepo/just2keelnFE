import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 p-8 text-gray-800 border-t-4 border-gray-300 mt-12">
      {/* Footer Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Just2Kleen</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Just2Kleen connects clients and service providers for efficient, affordable, and customized cleaning
            solutions, ensuring high-quality service and convenience for both.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">123 Clean Street, Service City, 98765</li>
            <li className="flex items-center">+1 (555) 123-4567</li>
            <li className="flex items-center">contact@just2kleen.com</li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-gray-700">
            <a
              href="https://facebook.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-blue-100"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="https://twitter.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-blue-100"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a
              href="https://instagram.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-pink-100"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="https://linkedin.com"
              className="p-2 rounded-full bg-gray-200 hover:bg-blue-100"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Links and Copyright */}
      <div className="mt-8 border-t pt-4 text-center">
        <div className="space-x-4 mb-2">
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

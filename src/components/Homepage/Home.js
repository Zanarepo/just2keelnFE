import React from 'react';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import CTASection from './CTASection';
import AboutUsSection from './AboutUsSection';
import FeaturesKleen from './Features';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import SearchAndBookComponent from "../QuotesDashboard/SearchAndBookComponent"; // Import the search component

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <HowItWorksSection />

      {/* Search component added here */}
      <section className="py-16 bg-white-100">
        <div className="">
          <SearchAndBookComponent /> {/* Search and Book component */}
        </div>
      </section>

      <CTASection />
      <AboutUsSection />
      <FeaturesKleen />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />

      {/* ToastContainer added here */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default HomePage;

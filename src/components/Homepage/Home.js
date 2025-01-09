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
import CleaningPricesForm from "../Homepage/CleaningPricesForm"; // Import the CleaningPricesForm component
import CleaningServicesSlideshow from './CleaningServicesSlideshow'; // Import the CleaningServicesSlideshow component
import CleaningOfferingsSlideshow from './CleaningOfferingsSlideshow'; // Import the CleaningOfferingsSlideshow component

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSection />
      
      {/* Cleaning Services Slideshow added here */}
      <section className="py-12 bg-white-100">
        <div className="container mx-auto">
          <CleaningServicesSlideshow /> {/* Cleaning Services Slideshow */}
        </div>
      </section>

      <HowItWorksSection />

      {/* Cleaning Offerings Slideshow added here */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto">
      
          <CleaningOfferingsSlideshow /> {/* Cleaning Offerings Slideshow */}
        </div>
      </section>

      {/* Search and Book component added here */}
      <section className="py-0 bg-white-100">
        <div className="">
          <SearchAndBookComponent /> {/* Search and Book component */}
        </div>
      </section>

      {/* Cleaning Prices Form added here */}
      <section className="py-10 bg-white-500">
        <div className="container mx-auto">
          <CleaningPricesForm /> {/* Cleaning Prices Form */}
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

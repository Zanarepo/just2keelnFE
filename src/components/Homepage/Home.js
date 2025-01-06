import React from "react";
import HeaderSection from "./HeaderSection";
import FeaturesSection from "./FeaturesSection";
import CallToAction from "./CallToAction";
import WhyJust2kleen from "./WhyJust2kleen";  // Import the WhyDatafy component



const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Header Section */}
      <HeaderSection />
      
      {/* Why Datafy Section */}
      <WhyJust2kleen />  {/* Insert WhyDatafy here */}

      {/* Features Section */}
      <FeaturesSection />

     

      {/* Call to Action */}
      <CallToAction />
      
    </div>

  );
};

export default HomePage;

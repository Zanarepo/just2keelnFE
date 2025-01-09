import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

// Array of services with placeholder images
const services = [
  { name: "Post-construction Cleaning", image: "images/postcon.jpg" },
  { name: "Pre-construction Cleaning", image: "images/precon.jpg" },
  { name: "Move-in/Move-out Cleaning", image: "images/EMove-out.jpg" },
  { name: "Event Cleaning Services", image: "images/eventCleanin.jpg" },
  { name: "Domestic Cleaning", image: "images/Domestic2.jpg" },
  { name: "Industrial Cleaning", image: "images/industrial.jpg" },
  { name: "Special Cleaning Services", image: "images/Speicialclean.jpg" },
  { name: "Stay-in Cleaner", image: "images/HomeService.jpg" },
];

const CleaningServicesSlideshow = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-8">Explore Our Cleaning Offerings</h2>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}   
          spaceBetween={20}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="w-full max-w-6xl mx-auto"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    High-quality {service.name.toLowerCase()} to ensure cleanliness and comfort.
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CleaningServicesSlideshow;

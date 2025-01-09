import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const services = [

  { type: "Before", image: "images/ABefore.jpeg" },
  { type: "After", image: "images/AAfter.jpeg" },
  { type: "Before", image: "images/fbefore.jpeg" },
  { type: "After", image: "images/fafter.jpeg" },
  { type: "Before", image: "images/Hbefore.jpeg" },
  { type: "After", image: "images/Hafter.jpeg" },
  { type: "Before", image: "images/Bbefore.jpeg" },
  { type: "After", image: "images/Bafter.jpeg" },
 
];

const CleaningServicesSlideshow = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-8">Our Work Speaks Volume</h2>
        
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
                  alt={service.type}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    {service.type}
                  </h3>
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

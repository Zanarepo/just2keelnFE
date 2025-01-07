import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'John Doe',
      role: 'Client',
      photo: 'path-to-photo-1.jpg', // Replace with actual image path
      review: 'Just2Kleen made it so easy to find a reliable cleaner for my office. The booking process was seamless, and the cleaner was professional and thorough. Highly recommended!',
    },
    {
      name: 'Jane Smith',
      role: 'Cleaner',
      photo: 'path-to-photo-2.jpg', // Replace with actual image path
      review: 'I love how Just2Kleen lets me work on my own schedule. The platform is easy to use, and the clients are fantastic. It&apos;s the perfect way to earn and build a reputation.',
    }
  ];

  return (
    <section className="testimonials-section bg-gray-50 py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          What Our Clients &amp; Cleaners Say
        </h2>
        <div className="testimonials-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-item bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center transition transform hover:scale-105 hover:shadow-xl"
            >
              
              <div className="testimonial-text">
                <h3 className="text-3xl font-bold text-center text-green-700 mb-8">
                  {testimonial.name}
                </h3>
                <p className="testimonial-role text-md font-medium text-gray-500 mb-4">
                  {testimonial.role}
                </p>
                <p className="testimonial-review text-lg text-gray-600 italic">
                 &quot;{testimonial.review}&quot;
                 </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

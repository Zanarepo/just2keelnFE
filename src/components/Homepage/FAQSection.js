import React, { useState } from 'react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I request a quote?",
      answer: "You can request a quote by browsing our platform and selecting the service you need. You can submit your request and receive quotes from multiple service providers."
    },
    {
      question: "How are service providers vetted?",
      answer: "All service providers on Just2Kleen are vetted through a thorough verification process, including background checks, skill assessments, and customer reviews, ensuring high-quality service."
    },
    {
      question: "What happens if my cleaner is unavailable?",
      answer: "If your regular cleaner is unavailable, we offer standby replacements from other trusted service providers, ensuring uninterrupted service."
    },
    {
      question: "How do cleaners get paid?",
      answer: "Cleaners are paid per service completed. Payments are processed through the platform, and cleaners can track their earnings through their dashboards."
    }
  ];

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section py-16 bg-white-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
        <h2 className="faq-heading text-3xl font-bold text-center text-green-700 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="faq-list space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 ${
                activeIndex === index ? 'shadow-lg' : ''
              }`}
            >
              <button
                className="faq-question text-lg font-semibold text-gray-700 w-full flex items-center justify-between focus:outline-none"
                onClick={() => toggleAnswer(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{faq.question}</span>
                <span 
                  className={`arrow text-2xl transform transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                >
                  ↓
                </span>
              </button>
              <div
                className={`faq-answer overflow-hidden transition-all duration-300 mt-3 ${
                  activeIndex === index ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

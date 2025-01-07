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
    <section className="faq-section py-12 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="faq-heading text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Frequently Asked Questions
        </h2>
        <div className="faq-list space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item border-b border-gray-200 pb-6">
              <button
                className="faq-question text-lg text-left font-medium text-gray-700 w-full flex items-center justify-between"
                onClick={() => toggleAnswer(index)}
              >
                <span>{faq.question}</span>
                <span className={`arrow text-2xl ${activeIndex === index ? 'rotate-180' : ''}`}>↓</span>
              </button>
              {activeIndex === index && (
                <p className="faq-answer text-gray-600 mt-2 text-base">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

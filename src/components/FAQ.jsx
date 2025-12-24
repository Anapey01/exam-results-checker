import { useState } from 'react';
import './FAQ.css';

const faqs = [
    {
        question: 'How do I check my results?',
        answer: 'Select your exam type, enter your index number, complete payment, and receive your access credentials instantly via SMS or email.'
    },
    {
        question: 'What payment methods are accepted?',
        answer: 'We accept Mobile Money (MTN, Vodafone, AirtelTigo) and card payments through secure payment channels.'
    },
    {
        question: 'How long does delivery take?',
        answer: 'Results are delivered instantly after payment confirmation - typically within 1 minute.'
    },
    {
        question: 'Is my information secure?',
        answer: 'Yes. All transactions are encrypted and we never store your payment details. Your data is protected.'
    },
    {
        question: 'What if I don\'t receive my results?',
        answer: 'Contact our support team via WhatsApp or phone. We\'ll resolve any issues within 24 hours.'
    },
    {
        question: 'Can schools buy in bulk?',
        answer: 'Yes! Schools and institutions get up to 30% discount on bulk purchases with CSV export and dashboard access.'
    }
];

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section" id="faq">
            <div className="container">
                <div className="faq-header">
                    <span className="faq-label">Support</span>
                    <h2 className="faq-title">Frequently Asked Questions</h2>
                    <p className="faq-subtitle">Quick answers to common questions</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFaq(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className="faq-icon"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;

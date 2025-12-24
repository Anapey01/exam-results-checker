import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './FAQPage.css';

const faqs = [
    {
        category: 'General',
        items: [
            {
                question: 'What is ResultGate?',
                answer: 'ResultGate is an online platform that helps students check examination results using the official WAEC or NECO result portals and provides guidance on possible academic pathways.'
            },
            {
                question: 'Is ResultGate part of WAEC or NECO?',
                answer: 'No. ResultGate is independent and not affiliated with WAEC, NECO, or any examination body. We do not conduct exams or issue certificates.'
            },
            {
                question: 'Who can use ResultGate?',
                answer: 'ResultGate is designed for students, parents, and guardians who want to access results and receive guidance.'
            }
        ]
    },
    {
        category: 'Result Checking',
        items: [
            {
                question: 'How does ResultGate check my result?',
                answer: 'ResultGate uses the WAEC or NECO result portals to fetch results using the serial number and PIN. We do not generate, alter, or store results permanently.'
            },
            {
                question: 'Where do my results come from?',
                answer: 'All results displayed come directly from the official examination bodies\' portals.'
            },
            {
                question: 'Can ResultGate change or improve my results?',
                answer: 'No. ResultGate cannot modify, improve, or influence results issued by WAEC, NECO, or any exam body.'
            },
            {
                question: 'How many times can I use a WAEC/NECO PIN?',
                answer: 'Each result checker PIN can be used up to three (3) times only. Each check counts as one use. Once all attempts are used, the PIN becomes invalid.'
            },
            {
                question: 'Can I use the same PIN for multiple students or index numbers?',
                answer: 'No. Each PIN is strictly for one student (one index number) only.'
            },
            {
                question: 'Can I check my own result more than once?',
                answer: 'Yes, as long as you have not exceeded the 3 allowed checks.'
            }
        ]
    },
    {
        category: 'Purchases & PIN Re-Issuance',
        items: [
            {
                question: 'I bought a checker but lost the PIN. Can I get it again?',
                answer: 'Yes. If you purchased a checker from ResultGate and lost your PIN, you can request a re-issue by providing your transaction reference or hash. We will re-send the same PIN originally issued to you, if it has not already been fully used.'
            },
            {
                question: 'Will I get a new PIN if I lost mine?',
                answer: 'No. ResultGate does not generate new PINs. Only the original PIN linked to your purchase can be re-sent.'
            },
            {
                question: 'What happens if all 3 attempts are used?',
                answer: 'Once the PIN has been used for all 3 allowed attempts, it cannot be reused or re-issued.'
            },
            {
                question: 'How do I request my lost PIN?',
                answer: 'Provide your transaction reference or hash via the support form on ResultGate. We will verify your purchase and re-issue the same PIN if eligible.'
            }
        ]
    },
    {
        category: 'Payments',
        items: [
            {
                question: 'Do I have to pay to use ResultGate?',
                answer: 'Some features may be free, while others, like checker PINs, require payment. All costs are clearly shown before purchase.'
            },
            {
                question: 'What am I paying for?',
                answer: 'Payments cover platform services, such as access, processing, and guidance features. The platform does not sell or alter examination results.'
            },
            {
                question: 'Are payments secure?',
                answer: 'Yes. Payments are processed via trusted third-party providers using secure, encrypted connections.'
            },
            {
                question: 'Can I get a refund?',
                answer: 'Refund eligibility depends on the service purchased and is clearly communicated before payment.'
            }
        ]
    },
    {
        category: 'Guidance & Recommendations',
        items: [
            {
                question: 'How does ResultGate provide guidance?',
                answer: 'We analyze your results and interests to suggest possible academic or career pathways. All guidance is advisory only; final decisions are made by institutions and examination authorities.'
            },
            {
                question: 'Are recommendations guaranteed?',
                answer: 'No. Recommendations are advice only. ResultGate does not guarantee admission or placement.'
            },
            {
                question: 'Does ResultGate favor certain schools or programs?',
                answer: 'No. We do not promote institutions based on payment, sponsorship, or partnerships.'
            }
        ]
    },
    {
        category: 'Security & Privacy',
        items: [
            {
                question: 'Is it safe to enter my serial number and PIN?',
                answer: 'Yes. ResultGate uses secure connections and standard web protections. Do not share your PIN with others.'
            },
            {
                question: 'Does ResultGate store my PIN?',
                answer: 'We store your PIN only to allow re-issuance upon verified purchase. It is encrypted and linked to your transaction reference. We do not retrieve or manage WAEC/NECO PINs directly.'
            },
            {
                question: 'How is my personal information protected?',
                answer: 'We use industry-standard security measures to protect student data and do not share it with third parties. Only necessary data for service delivery is stored.'
            },
            {
                question: 'Can parents or guardians use ResultGate?',
                answer: 'Yes. Parents or guardians can assist students in using ResultGate for result checking and guidance.'
            }
        ]
    },
    {
        category: 'Technical',
        items: [
            {
                question: 'What devices can I use ResultGate on?',
                answer: 'ResultGate works on mobile phones, tablets, and computers using modern browsers.'
            },
            {
                question: 'What should I do if the site is not working?',
                answer: 'Check your internet connection, refresh the page, and contact ResultGate support if issues persist.'
            },
            {
                question: 'Is ResultGate responsible for WAEC/NECO portal issues?',
                answer: 'No. We do not control the official examination portals. Any downtime or errors on their side are outside our control.'
            }
        ]
    },
    {
        category: 'Contact & Support',
        items: [
            {
                question: 'How can I contact ResultGate?',
                answer: 'Official support channels are listed on the Contact page. Avoid sharing your credentials with anyone outside official channels.'
            }
        ]
    }
];

function FAQPage() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFaq = (categoryIndex, itemIndex) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenIndex(openIndex === key ? null : key);
    };

    return (
        <div className="faq-page">
            <header className="faq-page-header">
                <div className="container">
                    <Link to="/" className="faq-logo">
                        <img src={logo} alt="ResultGate" />
                        <span>ResultGate</span>
                    </Link>
                </div>
            </header>

            <main className="faq-page-main">
                <div className="container">
                    <div className="faq-page-hero">
                        <span className="faq-badge">FAQ</span>
                        <h1>Frequently Asked Questions</h1>
                        <p>Everything you need to know about ResultGate</p>
                    </div>

                    <div className="faq-categories">
                        {faqs.map((category, catIndex) => (
                            <div key={catIndex} className="faq-category">
                                <h2 className="category-title">{category.category}</h2>
                                <div className="category-items">
                                    {category.items.map((item, itemIndex) => {
                                        const key = `${catIndex}-${itemIndex}`;
                                        const isOpen = openIndex === key;
                                        return (
                                            <div
                                                key={itemIndex}
                                                className={`faq-item ${isOpen ? 'open' : ''}`}
                                            >
                                                <button
                                                    className="faq-question"
                                                    onClick={() => toggleFaq(catIndex, itemIndex)}
                                                >
                                                    <span>{item.question}</span>
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M6 9l6 6 6-6" />
                                                    </svg>
                                                </button>
                                                <div className="faq-answer">
                                                    <p>{item.answer}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Important Notice */}
                    <div className="faq-notice">
                        <div className="notice-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3>Important Notice</h3>
                        <p className="notice-text">
                            ResultGate is an independent support platform. For official confirmation of results, certificates, or corrections, always contact WAEC, NECO, or the relevant examination body directly.
                        </p>
                    </div>

                    <div className="faq-contact">
                        <h3>Still have questions?</h3>
                        <p>Our support team is ready to help</p>
                        <div className="contact-options">
                            <a href="https://wa.me/233545142658" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp
                            </a>
                            <a href="tel:+233545142658" className="contact-btn phone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                Call Us
                            </a>
                        </div>
                    </div>

                    <div className="back-home">
                        <Link to="/">← Back to Home</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default FAQPage;

import './HowItWorks.css';

const steps = [
    {
        number: '01',
        title: 'Select',
        description: 'Choose single or bulk access',
        icon: 'target'
    },
    {
        number: '02',
        title: 'Pay',
        description: 'Secure payment options',
        icon: 'card'
    },
    {
        number: '03',
        title: 'Receive',
        description: 'Instant SMS or email delivery',
        icon: 'mail'
    },
    {
        number: '04',
        title: 'Access',
        description: 'View your results',
        icon: 'check'
    }
];

// SVG Icons
const icons = {
    target: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    ),
    card: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
    ),
    mail: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 6L12 13L2 6" />
        </svg>
    ),
    check: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
        </svg>
    )
};

function HowItWorks() {
    return (
        <section className="how-it-works">
            <div className="container">
                <div className="hiw-header">
                    <span className="hiw-label">Simple Process</span>
                    <h2 className="hiw-title">How It Works</h2>
                    <p className="hiw-subtitle">
                        Four simple steps to your results
                    </p>
                </div>

                <div className="hiw-timeline">
                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className="hiw-step"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <div className="step-icon-container">
                                <div className="step-icon-wrapper">
                                    <span className="step-icon">{icons[step.icon]}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="step-connector">
                                        <div className="connector-line"></div>
                                    </div>
                                )}
                            </div>
                            <div className="step-content">
                                <span className="step-number">{step.number}</span>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hiw-cta">
                    <a href="/single" className="btn btn-accent btn-lg">
                        Get Started Now
                    </a>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;

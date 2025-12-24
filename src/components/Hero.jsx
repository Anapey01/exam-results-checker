import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      {/* Animated Background Elements */}
      <div className="hero-bg">
        <div className="hero-gradient-orb hero-orb-1"></div>
        <div className="hero-gradient-orb hero-orb-2"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="hero-container">
        {/* Trust Badge */}
        <div className="hero-badge animate-fade-in">
          <CheckIcon className="badge-icon" />
          <span>Trusted by students & schools</span>
        </div>

        {/* WHY - Problem (not shown as label) */}
        <h1 className="hero-title animate-fade-in-up">
          Getting your exam results shouldn't be
          <span className="hero-highlight"> stressful</span>
        </h1>

        {/* HOW - Solution (not shown as label) */}
        <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          We guide you step-by-step through a secure process.
        </p>

        {/* WHAT - Actions (not shown as label) */}
        <div className="hero-cta-group animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <a href="/single" className="btn btn-accent btn-lg hero-cta-primary">
            <span>Check Results</span>
            <ArrowIcon />
          </a>
          <a href="/bulk" className="btn btn-secondary btn-lg hero-cta-secondary">
            Schools & Agents
          </a>
        </div>

        {/* Trust Notes */}
        <div className="hero-trust-notes animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="trust-note">
            <LightningIcon className="trust-icon" />
            <span>Instant delivery</span>
          </div>
          <div className="trust-note">
            <ShieldIcon className="trust-icon" />
            <span>Secure process</span>
          </div>
          <div className="trust-note">
            <DocumentIcon className="trust-icon" />
            <span>Official access</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// SVG Icon Components
function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function LightningIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  );
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
  );
}

export default Hero;

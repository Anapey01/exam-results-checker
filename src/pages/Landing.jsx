import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import TrustSection from '../components/TrustSection';
import './Landing.css';

function Landing() {
    return (
        <div className="landing-page">
            <Navbar />
            <Hero />
            <div id="how-it-works">
                <HowItWorks />
            </div>
            <TrustSection />
            <Footer />
        </div>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3 className="footer-logo">ResultGate</h3>
                        <p className="footer-tagline">
                            Secure, reliable access to official examination results.
                        </p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Access</h4>
                            <a href="/single">Single Result</a>
                            <a href="/bulk">Bulk Access</a>
                            <a href="/dashboard">Dashboard</a>
                        </div>
                        <div className="footer-column">
                            <h4>Support</h4>
                            <a href="/faq">FAQ</a>
                            <a href="/contact">Contact Us</a>
                        </div>
                        <div className="footer-column">
                            <h4>Legal</h4>
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} ResultGate. All rights reserved.</p>
                    <p className="footer-disclaimer">
                        ResultGate does not host examination results. We provide secure access guidance to official portals.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Landing;

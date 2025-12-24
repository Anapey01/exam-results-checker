import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './LegalPage.css';

function PrivacyPolicy() {
    return (
        <div className="legal-page">
            <header className="legal-header">
                <div className="container">
                    <Link to="/" className="legal-logo">
                        <img src={logo} alt="ResultGate" />
                        <span>ResultGate</span>
                    </Link>
                </div>
            </header>

            <main className="legal-content">
                <div className="container">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last updated: December 2024</p>

                    <section>
                        <h2>1. Information We Collect</h2>
                        <p>We collect information you provide directly:</p>
                        <ul>
                            <li><strong>Contact Information:</strong> Email address, phone number</li>
                            <li><strong>Academic Information:</strong> Index number, examination type</li>
                            <li><strong>Transaction Data:</strong> Purchase history, transaction references</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. How We Use Your Information</h2>
                        <p>Your information is used to:</p>
                        <ul>
                            <li>Process result checks and deliver PINs</li>
                            <li>Provide academic guidance based on results</li>
                            <li>Send transaction confirmations</li>
                            <li>Respond to support requests</li>
                            <li>Improve our services</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Data Storage and Security</h2>
                        <p>We implement industry-standard security measures:</p>
                        <ul>
                            <li>All data is encrypted in transit (HTTPS)</li>
                            <li>PINs are stored encrypted and linked to transaction references</li>
                            <li>We do not store payment card information</li>
                            <li>Access to data is restricted to authorized personnel</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Information Sharing</h2>
                        <p>We do not sell your personal information. We may share data with:</p>
                        <ul>
                            <li><strong>Payment Processors:</strong> To process transactions securely</li>
                            <li><strong>Legal Requirements:</strong> When required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data (subject to legal requirements)</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Cookies</h2>
                        <p>We use essential cookies for:</p>
                        <ul>
                            <li>Session management</li>
                            <li>Security purposes</li>
                        </ul>
                        <p>We do not use third-party tracking cookies.</p>
                    </section>

                    <section>
                        <h2>7. Third-Party Services</h2>
                        <p>Our platform uses:</p>
                        <ul>
                            <li><strong>Google Fonts:</strong> For typography</li>
                            <li><strong>Payment Providers:</strong> For secure payment processing</li>
                        </ul>
                        <p>These services have their own privacy policies.</p>
                    </section>

                    <section>
                        <h2>8. Children's Privacy</h2>
                        <p>Our services are intended for students, which may include minors. Parents or guardians may use the platform on behalf of students. We collect only necessary information for service delivery.</p>
                    </section>

                    <section>
                        <h2>9. Changes to This Policy</h2>
                        <p>We may update this policy periodically. Significant changes will be communicated through the platform.</p>
                    </section>

                    <section>
                        <h2>10. Contact Us</h2>
                        <p>For privacy-related inquiries, contact us via WhatsApp at +233 545 142 658.</p>
                    </section>

                    <div className="legal-footer">
                        <Link to="/">← Back to Home</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default PrivacyPolicy;

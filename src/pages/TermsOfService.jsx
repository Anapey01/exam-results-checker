import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './LegalPage.css';

function TermsOfService() {
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
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last updated: December 2024</p>

                    <section>
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using ResultGate ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
                    </section>

                    <section>
                        <h2>2. Description of Service</h2>
                        <p>ResultGate provides a platform for checking examination results from official examination bodies (WAEC, NECO) and offers guidance on academic pathways. We do not:</p>
                        <ul>
                            <li>Conduct examinations or issue certificates</li>
                            <li>Generate, modify, or alter examination results</li>
                            <li>Guarantee admission or placement at any institution</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. User Responsibilities</h2>
                        <p>Users are responsible for:</p>
                        <ul>
                            <li>Providing accurate information when using the platform</li>
                            <li>Keeping PIN and serial numbers confidential</li>
                            <li>Using checker PINs within the allowed usage limits (3 times per PIN)</li>
                            <li>Not sharing account credentials with others</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Payment Terms</h2>
                        <p>Payments are processed through secure third-party payment providers. By making a purchase, you agree that:</p>
                        <ul>
                            <li>All prices are displayed in Ghanaian Cedis (GH₵)</li>
                            <li>Payments are final once processed</li>
                            <li>Refunds are subject to our refund policy</li>
                            <li>We do not store payment card information</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. PIN Usage and Re-issuance</h2>
                        <p>Each result checker PIN can be used up to three (3) times only. If you lose your PIN:</p>
                        <ul>
                            <li>You may request re-issuance with your transaction reference</li>
                            <li>Only the original PIN can be re-sent (no new PINs)</li>
                            <li>Fully used PINs cannot be re-issued</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Limitation of Liability</h2>
                        <p>ResultGate is not responsible for:</p>
                        <ul>
                            <li>Downtime or errors on official examination portals</li>
                            <li>Accuracy of results displayed (we fetch directly from official sources)</li>
                            <li>Any decisions made based on guidance provided</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Intellectual Property</h2>
                        <p>All content, design, and code on ResultGate are proprietary. Users may not copy, reproduce, or distribute any part of the platform without written permission.</p>
                    </section>

                    <section>
                        <h2>8. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
                    </section>

                    <section>
                        <h2>9. Contact</h2>
                        <p>For questions about these terms, contact us via WhatsApp at +233 545 142 658 or through our support page.</p>
                    </section>

                    <div className="legal-footer">
                        <Link to="/">← Back to Home</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TermsOfService;

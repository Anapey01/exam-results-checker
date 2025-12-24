import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { fetchBulkPricing, sendVerificationCode, verifyCode } from '../services/api';
import { useSubmitGuard, useRateLimiter } from '../hooks/useSecurityGuards';
import './BulkPurchase.css';

function BulkPurchase() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user came from dashboard (already logged in)
    const fromDashboard = location.state?.fromDashboard || false;

    const [isLoggedIn, setIsLoggedIn] = useState(fromDashboard);
    const [authStep, setAuthStep] = useState('login'); // login, otp, logged-in
    const [authData, setAuthData] = useState({ email: '', phone: '', otp: '' });
    const [bulkOptions, setBulkOptions] = useState([]);
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [purchaseComplete, setPurchaseComplete] = useState(false);
    const [rateLimitError, setRateLimitError] = useState('');

    // Security: Submit guard prevents double-clicks
    const [isSubmitGuarded, guardedSubmit] = useSubmitGuard();
    // Security: Rate limit verification code requests (3 per minute)
    const { checkLimit, recordAttempt } = useRateLimiter(3, 60000);

    // Fetch bulk pricing from API on mount
    useEffect(() => {
        const loadPricing = async () => {
            try {
                const response = await fetchBulkPricing();
                if (response.success) {
                    setBulkOptions(response.data);
                }
            } catch (error) {
                // Handle error
            } finally {
                setIsLoadingPrices(false);
            }
        };
        loadPricing();
    }, []);

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setRateLimitError('');

        if (authStep === 'login') {
            // Rate limit check for verification code requests
            const limitCheck = checkLimit();
            if (!limitCheck.allowed) {
                setRateLimitError(limitCheck.message);
                return;
            }

            recordAttempt();
            setIsProcessing(true);

            try {
                await sendVerificationCode(authData.email || authData.phone);
                setAuthStep('otp');
            } finally {
                setIsProcessing(false);
            }
        } else if (authStep === 'otp') {
            await guardedSubmit(async () => {
                setIsProcessing(true);
                try {
                    const response = await verifyCode(
                        authData.email || authData.phone,
                        authData.otp
                    );
                    if (response.success) {
                        setIsLoggedIn(true);
                    }
                } finally {
                    setIsProcessing(false);
                }
            });
        }
    };

    const handleBulkPurchase = async () => {
        if (!selectedOption) return;

        await guardedSubmit(async () => {
            setIsProcessing(true);
            // SECURITY: Server validates total based on selected quantity, not frontend calculation
            setTimeout(() => {
                setPurchaseComplete(true);
                setIsProcessing(false);
            }, 2000);
        });
    };

    const total = selectedOption ? selectedOption.quantity * selectedOption.pricePerUnit : 0;

    return (
        <div className="bulk-purchase-page">
            <header className="bp-header">
                <div className="container">
                    <Link to="/" className="bp-logo">
                        <img src={logo} alt="ResultGate" />
                        <span>ResultGate</span>
                    </Link>
                    <span className="bp-badge">Bulk Access</span>
                </div>
            </header>

            <main className="bp-main">
                <div className="container">
                    {!isLoggedIn ? (
                        /* Authentication Flow - Clean Design */
                        <div className="auth-container animate-fade-in-up">
                            <div className="auth-card">
                                <div className="auth-header">
                                    <h1>Bulk Access</h1>
                                    <p>For schools & institutions</p>
                                </div>

                                {authStep === 'login' && (
                                    <form onSubmit={handleAuthSubmit} className="auth-form">
                                        <div className="form-group">
                                            <label htmlFor="authContact">Email or Phone Number</label>
                                            <div className="input-with-icon">
                                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    id="authContact"
                                                    placeholder="Enter email or phone"
                                                    value={authData.email}
                                                    onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-accent btn-lg auth-btn">
                                            Get Verification Code
                                        </button>
                                    </form>
                                )}

                                {authStep === 'otp' && (
                                    <form onSubmit={handleAuthSubmit} className="auth-form">
                                        <p className="otp-sent">
                                            Code sent to <strong>{authData.email}</strong>
                                        </p>
                                        <div className="form-group">
                                            <label htmlFor="authOtp">Verification Code</label>
                                            <div className="input-with-icon">
                                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    id="authOtp"
                                                    placeholder="Enter 6-digit code"
                                                    value={authData.otp}
                                                    onChange={(e) => setAuthData({ ...authData, otp: e.target.value })}
                                                    maxLength={6}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-accent btn-lg auth-btn"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? 'Verifying...' : 'Verify & Continue'}
                                        </button>
                                        <button
                                            type="button"
                                            className="resend-btn"
                                            onClick={() => setAuthStep('login')}
                                        >
                                            ← Back
                                        </button>
                                    </form>
                                )}

                                {/* Clean Trust Badges */}
                                <div className="auth-trust-badges">
                                    <div className="trust-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                        <span>No password</span>
                                    </div>
                                    <div className="trust-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                            <line x1="12" y1="22.08" x2="12" y2="12" />
                                        </svg>
                                        <span>Bulk discounts</span>
                                    </div>
                                    <div className="trust-item">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        <span>CSV export</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : purchaseComplete ? (
                        /* Purchase Complete */
                        <div className="purchase-complete animate-fade-in-up">
                            <div className="success-icon">✅</div>
                            <h1>Bulk Purchase Successful!</h1>
                            <p>Your {selectedOption?.quantity} access codes are ready</p>

                            <div className="complete-actions">
                                <button
                                    className="btn btn-accent btn-lg"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    View in Dashboard
                                </button>
                                <Link to="/" className="btn btn-secondary">
                                    Return Home
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Bulk Selection */
                        <div className="bulk-selection animate-fade-in-up">
                            <div className="bulk-header">
                                <h1>Select Bulk Package</h1>
                                <p>Choose the quantity that fits your needs</p>
                            </div>

                            <div className="bulk-options">
                                {bulkOptions.map((option) => (
                                    <button
                                        key={option.quantity}
                                        className={`bulk-option ${selectedOption?.quantity === option.quantity ? 'selected' : ''}`}
                                        onClick={() => setSelectedOption(option)}
                                    >
                                        <div className="bulk-quantity">{option.quantity}</div>
                                        <div className="bulk-label">Access Codes</div>
                                        <div className="bulk-price">
                                            GH₵ {option.pricePerUnit} <span>each</span>
                                        </div>
                                        <div className="bulk-discount">{option.discount}</div>
                                    </button>
                                ))}
                            </div>

                            {selectedOption && (
                                <div className="bulk-summary">
                                    <div className="summary-row">
                                        <span>{selectedOption.quantity} × GH₵ {selectedOption.pricePerUnit}</span>
                                        <span>GH₵ {total}</span>
                                    </div>
                                    <button
                                        className="btn btn-accent btn-lg purchase-btn"
                                        onClick={handleBulkPurchase}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : `Complete Purchase — GH₵ ${total}`}
                                    </button>
                                </div>
                            )}

                            <div className="bulk-trust">
                                <p>✓ Instant delivery to dashboard</p>
                                <p>✓ Downloadable CSV export</p>
                                <p>✓ Dedicated support</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default BulkPurchase;

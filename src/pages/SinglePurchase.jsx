import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { fetchExamPricing, processPayment, fetchResults } from '../services/api';
import { useSubmitGuard } from '../hooks/useSecurityGuards';
import { useFormValidation } from '../hooks/useFormValidation';
import MomoPaymentModal from '../components/MomoPaymentModal';
import './SinglePurchase.css';

// SVG Icon Components
function SuccessIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

// Simulated result data (would come from API in production)
const mockResults = {
    wassce: {
        subjects: [
            { name: 'Mathematics (Core)', grade: 'B2' },
            { name: 'English Language', grade: 'B3' },
            { name: 'Integrated Science', grade: 'A1' },
            { name: 'Social Studies', grade: 'B2' },
            { name: 'Elective Mathematics', grade: 'B3' },
            { name: 'Physics', grade: 'C4' },
            { name: 'Chemistry', grade: 'B2' },
            { name: 'Biology', grade: 'C5' },
        ],
        aggregate: 15,
        year: '2024',
    },
    bece: {
        subjects: [
            { name: 'English Language', grade: '5' },
            { name: 'Mathematics', grade: '4' },
            { name: 'Integrated Science', grade: '3' },
            { name: 'Social Studies', grade: '4' },
            { name: 'Ghanaian Language (Twi)', grade: '5' },
            { name: 'RME', grade: '4' },
        ],
        aggregate: 25,
        year: '2024',
    }
};

function SinglePurchase() {
    const [step, setStep] = useState(1);
    const [selectedExam, setSelectedExam] = useState(null);
    const [examTypes, setExamTypes] = useState([]);
    const [isLoadingPrices, setIsLoadingPrices] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFetchingResults, setIsFetchingResults] = useState(false);
    const [accessCredentials, setAccessCredentials] = useState(null);
    const [resultData, setResultData] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Form validation with real-time feedback
    const {
        values: formData,
        errors: formErrors,
        handleChange,
        handleBlur,
        validateAll,
        getFieldProps,
        getFieldError,
        reset: resetForm
    } = useFormValidation(
        { phone: '' },
        {
            phone: ['required', 'phone']
        }
    );

    // Copy feedback state
    const [copiedField, setCopiedField] = useState(null);

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Security: Submit guard prevents double-clicks
    const [isSubmitGuarded, guardedSubmit] = useSubmitGuard();

    // Fetch pricing from API on mount (SECURITY: prices from server, not hardcoded)
    useEffect(() => {
        const loadPricing = async () => {
            try {
                const response = await fetchExamPricing();
                if (response.success) {
                    setExamTypes(response.data);
                }
            } catch (error) {
                // Handle error - show fallback or error message
            } finally {
                setIsLoadingPrices(false);
            }
        };
        loadPricing();
    }, []);

    const handleExamSelect = (exam) => {
        setSelectedExam(exam);
        setStep(2);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Open payment modal when user clicks Pay
    const handleCheckout = (e) => {
        e.preventDefault();
        if (!formData.phone || formData.phone.length < 10) {
            return;
        }
        setShowPaymentModal(true);
    };

    // Handle payment initiation from modal
    const handlePaymentInitiated = async (paymentData) => {
        // This will be called when user confirms payment in the modal
        // The actual API call will happen here
        console.log('Payment initiated:', paymentData);

        // In production, this would call the backend to initiate Paystack payment
        // await initiatePaystackPayment(paymentData);
    };

    // Handle successful payment
    const handlePaymentSuccess = async (paymentData) => {
        setShowPaymentModal(false);
        setIsProcessing(true);

        try {
            // Process payment with backend after MoMo approval
            const response = await processPayment({
                examId: selectedExam.id,
                phone: paymentData.momoNumber,
                contact: paymentData.momoNumber,
                network: paymentData.network,
                expectedTotal: selectedExam.price
            });

            if (response.success) {
                setAccessCredentials({
                    pin: response.data.pin,
                    serial: response.data.serial,
                    examType: selectedExam.name,
                    phone: paymentData.momoNumber,
                    deliveredTo: paymentData.momoNumber,
                });
                setStep(3);
            }
        } catch (error) {
            console.error('Payment processing error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle payment error
    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
        setShowPaymentModal(false);
    };

    // Step 2: User clicks to view results - fetch from backend
    const handleViewResults = async () => {
        setIsFetchingResults(true);

        // Simulate backend fetching results using the credentials
        setTimeout(() => {
            setResultData({
                ...mockResults[selectedExam.id],
                examType: selectedExam.name,
                phone: formData.phone,
                candidateName: 'ABENA MENSAH', // Simulated - would come from backend
                deliveredTo: formData.phone,
                checkedAt: new Date().toLocaleString(),
                pin: accessCredentials.pin,
                serial: accessCredentials.serial,
            });
            setIsFetchingResults(false);
            setStep(4); // Go to results display
        }, 2000);
    };

    return (
        <div className="single-purchase-page">
            {/* Header */}
            <header className="sp-header">
                <div className="container">
                    <Link to="/" className="sp-logo">
                        <img src={logo} alt="ResultGate" />
                        <span>ResultGate</span>
                    </Link>
                    <div className="sp-progress">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                            <span className="step-num">1</span>
                            <span className="step-label">Select Exam</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                            <span className="step-num">2</span>
                            <span className="step-label">Your Details</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                            <span className="step-num">3</span>
                            <span className="step-label">View Results</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="sp-main">
                <div className="container">
                    {/* Step 1: Select Exam */}
                    {step === 1 && (
                        <div className="sp-step animate-fade-in-up">
                            <h1 className="sp-title">Check Your Results</h1>
                            <p className="sp-subtitle">Select your examination type to get started</p>

                            <div className="exam-cards">
                                {examTypes.map((exam) => (
                                    <button
                                        key={exam.id}
                                        className="exam-card"
                                        onClick={() => handleExamSelect(exam)}
                                    >
                                        <div className="exam-info">
                                            <h3 className="exam-name">{exam.name}</h3>
                                            <p className="exam-desc">{exam.description}</p>
                                        </div>
                                        <div className="exam-price">
                                            <span className="price-amount">GH₵ {exam.price}</span>
                                            <span className="price-label">per check</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details & Payment */}
                    {step === 2 && selectedExam && (
                        <div className="sp-step sp-step-form animate-fade-in-up">
                            <button className="back-btn" onClick={() => setStep(1)}>
                                ← Back to exam selection
                            </button>

                            <h1 className="sp-title">Enter Your Details</h1>
                            <p className="sp-subtitle">We'll assist you in checking your {selectedExam.name} results securely</p>

                            <form className="checkout-form checkout-form-centered" onSubmit={handleCheckout}>
                                <div className={`form-group ${getFieldError('phone') ? 'has-error' : ''}`}>
                                    <label htmlFor="phone">Phone Number *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="e.g., 0201234567"
                                        {...getFieldProps('phone')}
                                    />
                                    {getFieldError('phone') && (
                                        <span className="field-error">{getFieldError('phone')}</span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-accent btn-lg checkout-btn"
                                    disabled={isProcessing || !formData.phone}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay GH₵ ${selectedExam.price}`
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: Checker Display (PIN/Serial) */}
                    {step === 3 && accessCredentials && (
                        <div className="sp-step sp-checker animate-fade-in-up">
                            {/* Success Header */}
                            <div className="checker-success-header">
                                <div className="success-icon-wrapper">
                                    <SuccessIcon />
                                </div>
                                <h1 className="checker-success-title">Payment Successful!</h1>
                                <p className="checker-success-subtitle">
                                    Your access checker has been generated and sent to your contact info
                                </p>
                            </div>

                            {/* Credentials Card */}
                            {/* Digital Scratch Card */}
                            <div className="digital-scratch-card animate-scale-in">
                                <div className="card-pattern-overlay"></div>
                                <div className="card-content">
                                    <div className="card-header">
                                        <div className="card-logo">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                            </svg>
                                            <span>RESULTGATE ACCESS</span>
                                        </div>
                                        <div className="card-value">
                                            <span className="value-label">VALUE</span>
                                            <span className="value-amount">GHS {selectedExam?.price}</span>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="code-group">
                                            <label>PIN NUMBER</label>
                                            <div className="code-display pin-display">
                                                <span className="code-text">{accessCredentials.pin}</span>
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => copyToClipboard(accessCredentials.pin, 'pin')}
                                                    aria-label="Copy PIN"
                                                >
                                                    {copiedField === 'pin' ? (
                                                        <span className="copy-success">COPIED</span>
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="code-group">
                                            <label>SERIAL NUMBER</label>
                                            <div className="code-display serial-display">
                                                <span className="code-text">{accessCredentials.serial}</span>
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => copyToClipboard(accessCredentials.serial, 'serial')}
                                                    aria-label="Copy Serial"
                                                >
                                                    {copiedField === 'serial' ? (
                                                        <span className="copy-success">COPIED</span>
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="card-chip"></div>
                                        <div className="card-instruction">
                                            VALID FOR 3 USES • ONE INDEX NUMBER ONLY
                                        </div>
                                    </div>
                                </div>
                            </div>



                            {/* View Results CTA */}
                            <div className="view-results-section">
                                <div className="results-ready-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                    <span>Your results are ready!</span>
                                </div>
                                <button
                                    className="view-results-btn"
                                    onClick={handleViewResults}
                                    disabled={isFetchingResults}
                                >
                                    {isFetchingResults ? (
                                        <span className="btn-loading">
                                            <span className="spinner-ring"></span>
                                            Fetching Results...
                                        </span>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.35-4.35" />
                                            </svg>
                                            View My Results
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Compact Professional Results Display */}
                    {step === 4 && resultData && (
                        <div className="sp-step sp-results-compact animate-fade-in-up">
                            {/* Compact Header */}
                            <div className="results-compact-header">
                                <div className="results-badge-small">
                                    <SuccessIcon />
                                </div>
                                <div className="results-info">
                                    <h2 className="results-exam-title">{resultData.examType} Results</h2>
                                    <p className="results-candidate">{resultData.candidateName} • {resultData.year}</p>
                                </div>
                                <div className="aggregate-badge">
                                    <span className="agg-label">Aggregate</span>
                                    <span className="agg-score">{resultData.aggregate}</span>
                                </div>
                            </div>

                            {/* Compact Subject Grid - 2 columns */}
                            <div className="subjects-compact">
                                {resultData.subjects.map((subject, index) => (
                                    <div key={index} className="subject-row">
                                        <span className="subj-name">{subject.name}</span>
                                        <span className={`subj-grade grade-${subject.grade.charAt(0).toLowerCase()}`}>
                                            {subject.grade}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons - Side by Side */}
                            <div className="results-actions-compact">
                                <button
                                    className="action-btn-compact primary"
                                    onClick={() => window.print()}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Download
                                </button>
                                <button
                                    className="action-btn-compact secondary"
                                    onClick={() => {
                                        setStep(1);
                                        setSelectedExam(null);
                                        setResultData(null);
                                        setAccessCredentials(null);
                                        resetForm();
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
                                    </svg>
                                    New Check
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Mobile Money Payment Modal */}
            <MomoPaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                amount={selectedExam?.price || 0}
                currency="GH₵"
                examType={selectedExam?.name || ''}
                onPaymentInitiated={handlePaymentInitiated}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
            />
        </div>
    );
}

export default SinglePurchase;

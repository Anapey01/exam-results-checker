import { useState, useEffect } from 'react';
import './MomoPaymentModal.css?v=2.0';

// Ghana Mobile Network Prefixes
const NETWORK_PREFIXES = {
    MTN: ['024', '054', '055', '059', '025'],
    AIRTELTIGO: ['026', '027', '056', '057'],
    TELECEL: ['020', '050']
};

// Network display info
const NETWORK_INFO = {
    MTN: {
        name: 'MTN Mobile Money',
        shortName: 'MTN MoMo',
        color: '#FFCC00',
        bgColor: 'rgba(255, 204, 0, 0.1)',
        icon: '📱'
    },
    AIRTELTIGO: {
        name: 'AirtelTigo Money',
        shortName: 'AirtelTigo',
        color: '#E40000',
        bgColor: 'rgba(228, 0, 0, 0.1)',
        icon: '📱'
    },
    TELECEL: {
        name: 'Telecel Cash',
        shortName: 'Telecel',
        color: '#E60000',
        bgColor: 'rgba(230, 0, 0, 0.1)',
        icon: '📱'
    }
};

// Detect network from phone number
function detectNetwork(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const prefix = cleaned.substring(0, 3);

    for (const [network, prefixes] of Object.entries(NETWORK_PREFIXES)) {
        if (prefixes.includes(prefix)) {
            return network;
        }
    }
    return null;
}

// Format phone number for display
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    }
    return phone;
}

export default function MomoPaymentModal({
    isOpen,
    onClose,
    amount,
    currency = 'GH₵',
    examType,
    onPaymentInitiated,
    onPaymentSuccess,
    onPaymentError
}) {
    const [step, setStep] = useState('input'); // 'input', 'confirm', 'processing', 'prompt'
    const [momoNumber, setMomoNumber] = useState('');
    const [detectedNetwork, setDetectedNetwork] = useState(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('input');
            setMomoNumber('');
            setDetectedNetwork(null);
            setError('');
            setIsProcessing(false);
        }
    }, [isOpen]);

    // Auto-detect network as user types
    useEffect(() => {
        const cleaned = momoNumber.replace(/\D/g, '');
        if (cleaned.length >= 3) {
            const network = detectNetwork(momoNumber);
            setDetectedNetwork(network);
            if (cleaned.length >= 10 && !network) {
                setError('Invalid network. Please use MTN, AirtelTigo, or Telecel number.');
            } else {
                setError('');
            }
        } else {
            setDetectedNetwork(null);
            setError('');
        }
    }, [momoNumber]);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 10) {
            setMomoNumber(value);
        }
    };

    const handleProceed = () => {
        const cleaned = momoNumber.replace(/\D/g, '');

        if (cleaned.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        if (!detectedNetwork) {
            setError('Please use a valid MTN, AirtelTigo, or Telecel number');
            return;
        }

        setStep('confirm');
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        setStep('processing');

        try {
            // Call the payment initiation callback
            if (onPaymentInitiated) {
                await onPaymentInitiated({
                    momoNumber,
                    network: detectedNetwork,
                    amount,
                    examType
                });
            }

            // Simulate payment prompt being sent (in real app, this comes from backend webhook)
            setTimeout(() => {
                setStep('prompt');
                setIsProcessing(false);
            }, 2000);

        } catch (err) {
            setError(err.message || 'Payment initiation failed');
            setStep('input');
            setIsProcessing(false);
            if (onPaymentError) {
                onPaymentError(err);
            }
        }
    };

    const handlePaymentComplete = () => {
        // This would be triggered by a webhook in production
        if (onPaymentSuccess) {
            onPaymentSuccess({
                momoNumber,
                network: detectedNetwork,
                amount
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    const networkInfo = detectedNetwork ? NETWORK_INFO[detectedNetwork] : null;

    return (
        <div className="momo-modal-overlay" onClick={onClose}>
            <div className="momo-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="momo-modal-header">
                    <h2>Mobile Money Payment</h2>
                    <button className="momo-close-btn" onClick={onClose}>×</button>
                </div>



                {/* Step: Input Phone Number */}
                {step === 'input' && (
                    <div className="momo-step animate-fade-in">
                        <div className="momo-input-group">
                            <label>Mobile Money Number</label>
                            <div className={`momo-input-wrapper ${detectedNetwork ? 'network-detected' : ''}`}>
                                <div className="country-prefix">
                                    <img src="https://flagcdn.com/w20/gh.png" alt="Ghana" className="gh-flag" />
                                    <span>+233</span>
                                </div>
                                <input
                                    type="tel"
                                    value={momoNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="024 123 4567"
                                    autoFocus
                                    className="momo-input-field"
                                />
                                {detectedNetwork && (
                                    <div className="network-indicator">

                                    </div>
                                )}
                            </div>
                            {error ? (
                                <span className="momo-error-msg">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    {error}
                                </span>
                            ) : (
                                <span className="momo-helper-text">Enter your 10-digit number</span>
                            )}
                        </div>

                        <button
                            className="momo-proceed-btn"
                            onClick={handleProceed}
                            disabled={momoNumber.length < 10 || !detectedNetwork}
                        >
                            <span>Pay {currency} {amount}</span>
                        </button>
                    </div>
                )}

                {/* Step: Confirm Payment */}
                {step === 'confirm' && networkInfo && (
                    <div className="momo-step animate-fade-in">
                        <div className="momo-confirm-card" style={{ borderColor: networkInfo.color }}>
                            <div className="confirm-network" style={{ backgroundColor: networkInfo.bgColor }}>

                                <span className="network-name" style={{ color: networkInfo.color }}>
                                    {networkInfo.name}
                                </span>
                            </div>
                            <div className="confirm-details">
                                <div className="confirm-row">
                                    <span>Mobile Number</span>
                                    <strong>{formatPhoneNumber(momoNumber)}</strong>
                                </div>
                                <div className="confirm-row">
                                    <span>Amount</span>
                                    <strong>{currency} {amount}</strong>
                                </div>
                            </div>
                        </div>

                        <p className="confirm-notice">
                            Check your handset for the authorization prompt.
                        </p>

                        <div className="momo-actions">
                            <button className="momo-back-btn" onClick={() => setStep('input')}>
                                Change Number
                            </button>
                            <button
                                className="momo-confirm-btn"
                                onClick={handleConfirmPayment}
                                style={{ backgroundColor: networkInfo.color }}
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Processing */}
                {step === 'processing' && (
                    <div className="momo-step momo-processing animate-fade-in">
                        <div className="processing-spinner"></div>
                        <h3>Initiating Payment...</h3>
                        <p>Please wait while we connect to {networkInfo?.name}</p>
                    </div>
                )}

                {/* Step: Waiting for PIN prompt */}
                {step === 'prompt' && networkInfo && (
                    <div className="momo-step momo-prompt animate-fade-in">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px', color: 'white' }}>Authorize Payment</h3>
                        <p style={{ marginBottom: '24px', color: '#9CA3AF' }}>
                            A prompt has been sent to<br />
                            <strong style={{ color: 'white' }}>{formatPhoneNumber(momoNumber)}</strong>
                        </p>

                        <p className="confirm-notice">
                            Please approve the transaction on your mobile device.
                        </p>

                        <div className="prompt-waiting">
                            <div className="waiting-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span>Waiting for your approval...</span>
                        </div>

                        {/* For demo purposes - in production this button wouldn't exist */}
                        <button
                            className="momo-demo-complete-btn"
                            onClick={handlePaymentComplete}
                        >
                            ✓ I've Approved (Demo)
                        </button>
                    </div>
                )}

                {/* Security Footer */}
                <div className="momo-security-footer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>Secured by Paystack</span>
                </div>
            </div>
        </div>
    );
}

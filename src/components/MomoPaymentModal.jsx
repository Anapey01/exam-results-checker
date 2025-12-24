import { useState, useEffect } from 'react';
import './MomoPaymentModal.css';

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

                {/* Amount Display */}
                <div className="momo-amount-display">
                    <span className="amount-label">Amount to Pay</span>
                    <span className="amount-value">{currency} {amount}</span>
                    <span className="amount-exam">{examType} Result Check</span>
                </div>

                {/* Step: Input Phone Number */}
                {step === 'input' && (
                    <div className="momo-step animate-fade-in">
                        <div className="momo-networks-hint">
                            <span>Supported Networks:</span>
                            <div className="network-badges">
                                <span className="network-badge mtn">MTN</span>
                                <span className="network-badge airteltigo">AirtelTigo</span>
                                <span className="network-badge telecel">Telecel</span>
                            </div>
                        </div>

                        <div className="momo-input-group">
                            <label>Enter your MoMo number</label>
                            <div className="momo-input-wrapper">
                                <span className="country-code">+233</span>
                                <input
                                    type="tel"
                                    value={momoNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="024 XXX XXXX"
                                    autoFocus
                                    className={detectedNetwork ? 'has-network' : ''}
                                />
                                {networkInfo && (
                                    <div
                                        className="detected-network"
                                        style={{ backgroundColor: networkInfo.bgColor, color: networkInfo.color }}
                                    >
                                        {networkInfo.shortName}
                                    </div>
                                )}
                            </div>
                            {error && <span className="momo-error">{error}</span>}
                        </div>

                        <button
                            className="momo-proceed-btn"
                            onClick={handleProceed}
                            disabled={momoNumber.length < 10 || !detectedNetwork}
                        >
                            Proceed to Pay
                        </button>
                    </div>
                )}

                {/* Step: Confirm Payment */}
                {step === 'confirm' && networkInfo && (
                    <div className="momo-step animate-fade-in">
                        <div className="momo-confirm-card" style={{ borderColor: networkInfo.color }}>
                            <div className="confirm-network" style={{ backgroundColor: networkInfo.bgColor }}>
                                <span className="network-icon">{networkInfo.icon}</span>
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
                            You will receive a prompt on your phone to approve this payment.
                            Please ensure your phone is nearby.
                        </p>

                        <div className="momo-actions">
                            <button className="momo-back-btn" onClick={() => setStep('input')}>
                                ← Change Number
                            </button>
                            <button
                                className="momo-confirm-btn"
                                onClick={handleConfirmPayment}
                                style={{ backgroundColor: networkInfo.color }}
                            >
                                Send Payment Request
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
                        <div className="prompt-icon" style={{ backgroundColor: networkInfo.bgColor }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke={networkInfo.color} strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <h3>Check Your Phone!</h3>
                        <p>
                            A payment prompt has been sent to<br />
                            <strong>{formatPhoneNumber(momoNumber)}</strong>
                        </p>
                        <div className="prompt-instructions">
                            <div className="instruction-step">
                                <span className="step-number">1</span>
                                <span>You will receive a USSD prompt on your phone</span>
                            </div>
                            <div className="instruction-step">
                                <span className="step-number">2</span>
                                <span>Enter your MoMo PIN to approve</span>
                            </div>
                            <div className="instruction-step">
                                <span className="step-number">3</span>
                                <span>Wait for confirmation</span>
                            </div>
                        </div>

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

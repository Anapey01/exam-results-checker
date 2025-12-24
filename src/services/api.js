/**
 * API Service
 * 
 * Centralized API calls for the application.
 * In production, these should fetch from a real backend API.
 * All prices MUST be validated server-side before processing payments.
 */

// Base API URL - configure for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch exam pricing from the server
 * SECURITY: Prices are fetched from server, not hardcoded
 * Backend must validate prices again during checkout
 */
export async function fetchExamPricing() {
    // TODO: Replace with real API call
    // return fetch(`${API_BASE_URL}/pricing/exams`).then(res => res.json());

    // Simulated API response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: [
                    {
                        id: 'wassce',
                        name: 'WASSCE',
                        price: 50,
                        currency: 'GHS',
                        description: 'West African Senior School Certificate Examination'
                    },
                    {
                        id: 'bece',
                        name: 'BECE',
                        price: 30,
                        currency: 'GHS',
                        description: 'Basic Education Certificate Examination'
                    },
                ],
                // Include a server timestamp for validation
                timestamp: Date.now()
            });
        }, 100);
    });
}

/**
 * Fetch bulk pricing tiers from the server
 * SECURITY: All discount calculations happen server-side
 */
export async function fetchBulkPricing() {
    // TODO: Replace with real API call
    // return fetch(`${API_BASE_URL}/pricing/bulk`).then(res => res.json());

    // Simulated API response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: [
                    { quantity: 10, pricePerUnit: 45, discount: '10% off', totalPrice: 450 },
                    { quantity: 50, pricePerUnit: 40, discount: '20% off', totalPrice: 2000 },
                    { quantity: 100, pricePerUnit: 35, discount: '30% off', totalPrice: 3500 },
                ],
                timestamp: Date.now()
            });
        }, 100);
    });
}

/**
 * Process payment
 * SECURITY: 
 * - Server recalculates total from selected items
 * - Frontend price is used for display only
 * - Payment is processed server-side
 */
export async function processPayment(paymentData) {
    // TODO: Replace with real payment API
    // return fetch(`${API_BASE_URL}/payments/process`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(paymentData)
    // }).then(res => res.json());

    // Simulated payment response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    pin: `${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`,
                    serial: `WA${new Date().getFullYear()}${Math.floor(100000000 + Math.random() * 900000000)}`,
                    // Server-calculated total (authoritative)
                    confirmedTotal: paymentData.expectedTotal,
                    currency: 'GHS'
                }
            });
        }, 2000);
    });
}

/**
 * Verify email/phone for authentication
 */
export async function sendVerificationCode(contact) {
    // TODO: Implement with real API + rate limiting + CAPTCHA
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Verification code sent',
                // In production, code is never returned to frontend
                // This is for demo only
                _demoCode: '123456'
            });
        }, 1000);
    });
}

/**
 * Verify the code entered by user
 * 
 * ⚠️ MOCK AUTH — This is for demo/prototype purposes only.
 * In production, replace with:
 * - Backend-issued JWT or session token
 * - Short-lived tokens with refresh mechanism
 * - HTTP-only cookies for token storage
 * - Never trust client-side token generation
 */
export async function verifyCode(contact, code) {
    // TODO: Replace with real backend authentication
    return new Promise((resolve) => {
        setTimeout(() => {
            // MOCK: Demo validation only - not for production
            resolve({
                success: code === '123456',
                token: code === '123456' ? `mock_session_${Date.now()}` : null
            });
        }, 500);
    });
}

/**
 * Fetch exam results
 * SECURITY: Results are fetched from official sources via backend
 */
export async function fetchResults(indexNumber, pin, serial) {
    // TODO: Replace with real API that connects to WAEC/NECO
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    studentName: 'SAMPLE STUDENT',
                    indexNumber: indexNumber,
                    examYear: '2024',
                    examType: 'WASSCE',
                    subjects: [
                        { name: 'English Language', grade: 'B2' },
                        { name: 'Mathematics', grade: 'A1' },
                        { name: 'Integrated Science', grade: 'B3' },
                        { name: 'Social Studies', grade: 'A1' },
                        { name: 'Physics', grade: 'B2' },
                        { name: 'Chemistry', grade: 'B3' },
                        { name: 'Biology', grade: 'C4' },
                        { name: 'Elective Mathematics', grade: 'B2' },
                    ],
                    aggregate: 12,
                    pin: pin,
                    serial: serial
                }
            });
        }, 1500);
    });
}

/**
 * Fetch user's orders/purchases for dashboard
 * Returns order history with stats
 */
export async function fetchUserOrders() {
    // TODO: Replace with real API call
    // return fetch(`${API_BASE_URL}/orders`, {
    //     headers: { 'Authorization': `Bearer ${getAuthToken()}` }
    // }).then(res => res.json());

    // Simulated API response
    return new Promise((resolve) => {
        setTimeout(() => {
            const orders = [
                {
                    id: 'ORD-001',
                    date: '2024-12-23',
                    quantity: 50,
                    status: 'delivered',
                    codes: Array(50).fill(null).map(() => ({
                        pin: 'RG-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
                        serial: 'SN-' + Math.random().toString(36).substring(2, 14).toUpperCase(),
                    })),
                },
                {
                    id: 'ORD-002',
                    date: '2024-12-20',
                    quantity: 100,
                    status: 'delivered',
                    codes: Array(100).fill(null).map(() => ({
                        pin: 'RG-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
                        serial: 'SN-' + Math.random().toString(36).substring(2, 14).toUpperCase(),
                    })),
                },
            ];

            resolve({
                success: true,
                data: {
                    orders,
                    stats: {
                        totalOrders: orders.length,
                        totalCodes: orders.reduce((sum, o) => sum + o.quantity, 0),
                        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
                    }
                },
                timestamp: Date.now()
            });
        }, 300);
    });
}

/**
 * Fetch dashboard stats summary
 * Used for quick stats display without loading full order data
 */
export async function fetchDashboardStats() {
    // TODO: Replace with real API call
    // return fetch(`${API_BASE_URL}/dashboard/stats`).then(res => res.json());

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    totalOrders: 2,
                    totalCodes: 150,
                    deliveredOrders: 2,
                    pendingOrders: 0,
                    lastUpdated: Date.now()
                }
            });
        }, 100);
    });
}


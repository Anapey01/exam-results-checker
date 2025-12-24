import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    fetchExamPricing,
    fetchBulkPricing,
    processPayment,
    sendVerificationCode,
    verifyCode,
    fetchResults,
    fetchUserOrders,
    fetchDashboardStats
} from '../services/api';

describe('API Service', () => {
    describe('fetchExamPricing', () => {
        it('should return exam pricing data', async () => {
            const response = await fetchExamPricing();

            expect(response.success).toBe(true);
            expect(response.data).toBeInstanceOf(Array);
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.timestamp).toBeDefined();
        });

        it('should include WASSCE and BECE exams', async () => {
            const response = await fetchExamPricing();
            const examIds = response.data.map(e => e.id);

            expect(examIds).toContain('wassce');
            expect(examIds).toContain('bece');
        });

        it('should have required price fields', async () => {
            const response = await fetchExamPricing();
            const exam = response.data[0];

            expect(exam).toHaveProperty('id');
            expect(exam).toHaveProperty('name');
            expect(exam).toHaveProperty('price');
            expect(exam).toHaveProperty('currency');
        });
    });

    describe('fetchBulkPricing', () => {
        it('should return bulk pricing tiers', async () => {
            const response = await fetchBulkPricing();

            expect(response.success).toBe(true);
            expect(response.data).toBeInstanceOf(Array);
            expect(response.data.length).toBe(3);
        });

        it('should have decreasing price per unit for larger quantities', async () => {
            const response = await fetchBulkPricing();
            const prices = response.data.map(t => t.pricePerUnit);

            expect(prices[0]).toBeGreaterThan(prices[1]);
            expect(prices[1]).toBeGreaterThan(prices[2]);
        });
    });

    describe('processPayment', () => {
        it('should return success with transaction data', async () => {
            const paymentData = {
                examId: 'wassce',
                expectedTotal: 50
            };

            const response = await processPayment(paymentData);

            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('transactionId');
            expect(response.data).toHaveProperty('pin');
            expect(response.data).toHaveProperty('serial');
            expect(response.data).toHaveProperty('confirmedTotal');
        });

        it('should generate unique transaction IDs', async () => {
            const [response1, response2] = await Promise.all([
                processPayment({ examId: 'wassce', expectedTotal: 50 }),
                processPayment({ examId: 'bece', expectedTotal: 30 })
            ]);

            expect(response1.data.transactionId).not.toBe(response2.data.transactionId);
        });
    });

    describe('sendVerificationCode', () => {
        it('should send verification code successfully', async () => {
            const response = await sendVerificationCode('0545142658');

            expect(response.success).toBe(true);
            expect(response.message).toBe('Verification code sent');
        });
    });

    describe('verifyCode', () => {
        it('should verify correct code', async () => {
            const response = await verifyCode('0545142658', '123456');

            expect(response.success).toBe(true);
            expect(response.token).toBeDefined();
        });

        it('should reject incorrect code', async () => {
            const response = await verifyCode('0545142658', '000000');

            expect(response.success).toBe(false);
            expect(response.token).toBeNull();
        });
    });

    describe('fetchResults', () => {
        it('should return exam results', async () => {
            const response = await fetchResults('1234567890', 'TEST123', 'SERIAL123');

            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('studentName');
            expect(response.data).toHaveProperty('indexNumber');
            expect(response.data).toHaveProperty('subjects');
            expect(response.data).toHaveProperty('aggregate');
        });

        it('should include subjects with grades', async () => {
            const response = await fetchResults('1234567890', 'TEST123', 'SERIAL123');
            const subject = response.data.subjects[0];

            expect(subject).toHaveProperty('name');
            expect(subject).toHaveProperty('grade');
        });
    });

    describe('fetchUserOrders', () => {
        it('should return orders with stats', async () => {
            const response = await fetchUserOrders();

            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('orders');
            expect(response.data).toHaveProperty('stats');
            expect(response.data.orders).toBeInstanceOf(Array);
        });

        it('should include calculated stats', async () => {
            const response = await fetchUserOrders();
            const stats = response.data.stats;

            expect(stats).toHaveProperty('totalOrders');
            expect(stats).toHaveProperty('totalCodes');
            expect(stats).toHaveProperty('deliveredOrders');
        });
    });

    describe('fetchDashboardStats', () => {
        it('should return dashboard statistics', async () => {
            const response = await fetchDashboardStats();

            expect(response.success).toBe(true);
            expect(response.data).toHaveProperty('totalOrders');
            expect(response.data).toHaveProperty('totalCodes');
            expect(response.data).toHaveProperty('deliveredOrders');
            expect(response.data).toHaveProperty('lastUpdated');
        });
    });
});

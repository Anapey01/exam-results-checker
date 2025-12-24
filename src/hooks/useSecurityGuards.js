/**
 * Custom hook for button debouncing
 * Prevents double-clicks and rapid submissions
 */
import { useState, useCallback, useRef } from 'react';

/**
 * useDebounce - Debounces a callback function
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 500ms)
 */
export function useDebounce(callback, delay = 500) {
    const timeoutRef = useRef(null);

    const debouncedCallback = useCallback((...args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedCallback;
}

/**
 * useSubmitGuard - Prevents double form submissions
 * Returns [isSubmitting, guardedSubmit]
 */
export function useSubmitGuard() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const lastSubmitRef = useRef(0);
    const MIN_INTERVAL = 1000; // Minimum 1 second between submissions

    const guardedSubmit = useCallback(async (submitFn) => {
        const now = Date.now();

        // Prevent rapid re-submissions
        if (isSubmitting || (now - lastSubmitRef.current) < MIN_INTERVAL) {
            return null;
        }

        setIsSubmitting(true);
        lastSubmitRef.current = now;

        try {
            const result = await submitFn();
            return result;
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting]);

    return [isSubmitting, guardedSubmit];
}

/**
 * useRateLimiter - Rate limits actions (e.g., verification code requests)
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 */
export function useRateLimiter(maxAttempts = 3, windowMs = 60000) {
    const attemptsRef = useRef([]);

    const checkLimit = useCallback(() => {
        const now = Date.now();
        // Remove expired attempts
        attemptsRef.current = attemptsRef.current.filter(
            time => (now - time) < windowMs
        );

        if (attemptsRef.current.length >= maxAttempts) {
            const oldestAttempt = attemptsRef.current[0];
            const waitTime = Math.ceil((windowMs - (now - oldestAttempt)) / 1000);
            return {
                allowed: false,
                waitSeconds: waitTime,
                message: `Too many attempts. Please wait ${waitTime} seconds.`
            };
        }

        return { allowed: true };
    }, [maxAttempts, windowMs]);

    const recordAttempt = useCallback(() => {
        attemptsRef.current.push(Date.now());
    }, []);

    return { checkLimit, recordAttempt };
}

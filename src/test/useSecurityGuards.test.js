import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce, useSubmitGuard, useRateLimiter } from '../hooks/useSecurityGuards';

describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should debounce callback execution', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebounce(callback, 500));

        // Call debounced function multiple times
        act(() => {
            result.current('arg1');
            result.current('arg2');
            result.current('arg3');
        });

        // Callback should not be called yet
        expect(callback).not.toHaveBeenCalled();

        // Fast forward time
        act(() => {
            vi.advanceTimersByTime(500);
        });

        // Only last call should execute
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('arg3');
    });

    it('should respect custom delay', () => {
        const callback = vi.fn();
        const { result } = renderHook(() => useDebounce(callback, 1000));

        act(() => {
            result.current();
        });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(callback).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(callback).toHaveBeenCalledTimes(1);
    });
});

describe('useSubmitGuard', () => {
    it('should return isSubmitting as false initially', () => {
        const { result } = renderHook(() => useSubmitGuard());

        expect(result.current[0]).toBe(false);
        expect(typeof result.current[1]).toBe('function');
    });

    it('should guard against double submissions', async () => {
        const { result } = renderHook(() => useSubmitGuard());
        const [, guardedSubmit] = result.current;

        const mockSubmit = vi.fn().mockResolvedValue('success');

        // First submission
        await act(async () => {
            await guardedSubmit(mockSubmit);
        });

        expect(mockSubmit).toHaveBeenCalledTimes(1);

        // Second immediate submission should be blocked
        await act(async () => {
            const blocked = await result.current[1](mockSubmit);
            expect(blocked).toBeNull();
        });

        // Only one call should have gone through
        expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    it('should set isSubmitting during async operation', async () => {
        const { result } = renderHook(() => useSubmitGuard());

        let resolveSubmit;
        const mockSubmit = vi.fn().mockImplementation(() =>
            new Promise(resolve => { resolveSubmit = resolve; })
        );

        // Start submission
        let submitPromise;
        act(() => {
            submitPromise = result.current[1](mockSubmit);
        });

        // isSubmitting should be true
        expect(result.current[0]).toBe(true);

        // Complete submission
        await act(async () => {
            resolveSubmit('done');
            await submitPromise;
        });

        // isSubmitting should be false
        expect(result.current[0]).toBe(false);
    });
});

describe('useRateLimiter', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should allow actions within rate limit', () => {
        const { result } = renderHook(() => useRateLimiter(3, 60000));
        const { checkLimit, recordAttempt } = result.current;

        // First attempt
        expect(checkLimit().allowed).toBe(true);
        act(() => recordAttempt());

        // Second attempt
        expect(checkLimit().allowed).toBe(true);
        act(() => recordAttempt());

        // Third attempt
        expect(checkLimit().allowed).toBe(true);
        act(() => recordAttempt());
    });

    it('should block actions exceeding rate limit', () => {
        const { result } = renderHook(() => useRateLimiter(3, 60000));
        const { checkLimit, recordAttempt } = result.current;

        // Make 3 attempts
        for (let i = 0; i < 3; i++) {
            act(() => recordAttempt());
        }

        // Fourth should be blocked
        const check = checkLimit();
        expect(check.allowed).toBe(false);
        expect(check.message).toContain('Too many attempts');
    });

    it('should reset after time window expires', () => {
        const { result } = renderHook(() => useRateLimiter(3, 60000));
        const { checkLimit, recordAttempt } = result.current;

        // Make 3 attempts
        for (let i = 0; i < 3; i++) {
            act(() => recordAttempt());
        }

        // Should be blocked
        expect(checkLimit().allowed).toBe(false);

        // Advance time past window
        act(() => {
            vi.advanceTimersByTime(60001);
        });

        // Should be allowed again
        expect(result.current.checkLimit().allowed).toBe(true);
    });

    it('should calculate correct wait time', () => {
        const { result } = renderHook(() => useRateLimiter(2, 60000));
        const { checkLimit, recordAttempt } = result.current;

        // Make 2 attempts
        act(() => recordAttempt());
        act(() => recordAttempt());

        // Advance 30 seconds
        act(() => {
            vi.advanceTimersByTime(30000);
        });

        const check = result.current.checkLimit();
        expect(check.allowed).toBe(false);
        expect(check.waitSeconds).toBe(30); // Should wait ~30 more seconds
    });
});

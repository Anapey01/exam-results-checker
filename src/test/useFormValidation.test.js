import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation, validators } from '../hooks/useFormValidation';

describe('validators', () => {
    describe('required', () => {
        it('should return error for empty string', () => {
            expect(validators.required('')).toBe('This field is required');
            expect(validators.required('  ')).toBe('This field is required');
        });

        it('should return null for valid input', () => {
            expect(validators.required('hello')).toBeNull();
        });
    });

    describe('email', () => {
        it('should validate correct email format', () => {
            expect(validators.email('test@example.com')).toBeNull();
            expect(validators.email('user.name@domain.co.uk')).toBeNull();
        });

        it('should reject invalid email format', () => {
            expect(validators.email('invalid')).toBe('Please enter a valid email address');
            expect(validators.email('test@')).toBe('Please enter a valid email address');
            expect(validators.email('@domain.com')).toBe('Please enter a valid email address');
        });

        it('should return null for empty input', () => {
            expect(validators.email('')).toBeNull();
        });
    });

    describe('phone', () => {
        it('should validate Ghana phone format', () => {
            expect(validators.phone('0545142658')).toBeNull();
            expect(validators.phone('+233545142658')).toBeNull();
        });

        it('should reject invalid phone format', () => {
            expect(validators.phone('12345')).toBe('Please enter a valid phone number (e.g., 0545142658)');
            expect(validators.phone('abc')).toBe('Please enter a valid phone number (e.g., 0545142658)');
        });
    });

    describe('indexNumber', () => {
        it('should validate correct index number format', () => {
            expect(validators.indexNumber('1234567890')).toBeNull();
            expect(validators.indexNumber('1234567890AB')).toBeNull();
        });

        it('should reject short index numbers', () => {
            expect(validators.indexNumber('12345')).toBe('Index number must be at least 10 characters');
        });
    });

    describe('otp', () => {
        it('should validate 6-digit OTP', () => {
            expect(validators.otp('123456')).toBeNull();
            expect(validators.otp('000000')).toBeNull();
        });

        it('should reject invalid OTP', () => {
            expect(validators.otp('12345')).toBe('Please enter a 6-digit code');
            expect(validators.otp('1234567')).toBe('Please enter a 6-digit code');
            expect(validators.otp('abcdef')).toBe('Please enter a 6-digit code');
        });
    });

    describe('minLength', () => {
        it('should validate minimum length', () => {
            const minLength5 = validators.minLength(5);
            expect(minLength5('hello')).toBeNull();
            expect(minLength5('hi')).toBe('Must be at least 5 characters');
        });
    });
});

describe('useFormValidation', () => {
    const initialValues = { email: '', phone: '' };
    const validationRules = {
        email: ['required', 'email'],
        phone: ['required', 'phone']
    };

    it('should initialize with empty values and no errors', () => {
        const { result } = renderHook(() =>
            useFormValidation(initialValues, validationRules)
        );

        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
        expect(result.current.touched).toEqual({});
    });

    it('should update values on handleChange', () => {
        const { result } = renderHook(() =>
            useFormValidation(initialValues, validationRules)
        );

        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'test@example.com' }
            });
        });

        expect(result.current.values.email).toBe('test@example.com');
    });

    it('should validate on blur', () => {
        const { result } = renderHook(() =>
            useFormValidation(initialValues, validationRules)
        );

        act(() => {
            result.current.handleBlur({
                target: { name: 'email', value: '' }
            });
        });

        expect(result.current.touched.email).toBe(true);
        expect(result.current.errors.email).toBe('This field is required');
    });

    it('should validate all fields on validateAll', () => {
        const { result } = renderHook(() =>
            useFormValidation(initialValues, validationRules)
        );

        let isValid;
        act(() => {
            isValid = result.current.validateAll();
        });

        expect(isValid).toBe(false);
        expect(result.current.errors.email).toBe('This field is required');
        expect(result.current.errors.phone).toBe('This field is required');
    });

    it('should return true when all validations pass', () => {
        const { result } = renderHook(() =>
            useFormValidation(
                { email: 'test@example.com', phone: '0545142658' },
                validationRules
            )
        );

        let isValid;
        act(() => {
            isValid = result.current.validateAll();
        });

        expect(isValid).toBe(true);
        expect(result.current.errors.email).toBeNull();
        expect(result.current.errors.phone).toBeNull();
    });

    it('should reset form to initial state', () => {
        const { result } = renderHook(() =>
            useFormValidation(initialValues, validationRules)
        );

        // Make changes
        act(() => {
            result.current.handleChange({
                target: { name: 'email', value: 'test@example.com' }
            });
            result.current.validateAll();
        });

        // Reset
        act(() => {
            result.current.reset();
        });

        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
        expect(result.current.touched).toEqual({});
    });

    it('should provide getFieldProps helper', () => {
        const { result } = renderHook(() =>
            useFormValidation(initialValues, validationRules)
        );

        const fieldProps = result.current.getFieldProps('email');

        expect(fieldProps.name).toBe('email');
        expect(fieldProps.value).toBe('');
        expect(typeof fieldProps.onChange).toBe('function');
        expect(typeof fieldProps.onBlur).toBe('function');
    });
});

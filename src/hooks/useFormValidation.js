import { useState, useCallback } from 'react';

/**
 * Form validation rules
 */
const validators = {
    required: (value) => {
        if (!value || value.trim() === '') {
            return 'This field is required';
        }
        return null;
    },

    email: (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        return null;
    },

    phone: (value) => {
        if (!value) return null;
        // Ghana phone format: starts with 0 and has 10 digits, or +233 with 9 digits
        const phoneRegex = /^(0\d{9}|\+233\d{9})$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return 'Please enter a valid phone number (e.g., 0545142658)';
        }
        return null;
    },

    indexNumber: (value) => {
        if (!value) return null;
        // WAEC/WASSCE index format: number with letters, typically 10 chars
        const indexRegex = /^[0-9]{10}[A-Z0-9]*$/i;
        if (value.length < 10) {
            return 'Index number must be at least 10 characters';
        }
        if (!indexRegex.test(value)) {
            return 'Please enter a valid index number';
        }
        return null;
    },

    pin: (value) => {
        if (!value) return null;
        if (value.length < 8) {
            return 'PIN must be at least 8 characters';
        }
        return null;
    },

    serial: (value) => {
        if (!value) return null;
        if (value.length < 10) {
            return 'Serial number must be at least 10 characters';
        }
        return null;
    },

    otp: (value) => {
        if (!value) return null;
        if (!/^\d{6}$/.test(value)) {
            return 'Please enter a 6-digit code';
        }
        return null;
    },

    minLength: (min) => (value) => {
        if (!value) return null;
        if (value.length < min) {
            return `Must be at least ${min} characters`;
        }
        return null;
    },

    maxLength: (max) => (value) => {
        if (!value) return null;
        if (value.length > max) {
            return `Must be no more than ${max} characters`;
        }
        return null;
    }
};

/**
 * useFormValidation - Hook for form validation with visual feedback
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules per field
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validateField = useCallback((name, value) => {
        const rules = validationRules[name];
        if (!rules) return null;

        for (const rule of rules) {
            const error = typeof rule === 'function'
                ? rule(value)
                : validators[rule]?.(value);
            if (error) return error;
        }
        return null;
    }, [validationRules]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [errors]);

    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    }, [validateField]);

    const validateAll = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        for (const [name, rules] of Object.entries(validationRules)) {
            const error = validateField(name, values[name]);
            // Always set the field - null for valid, error message for invalid
            newErrors[name] = error;
            if (error) {
                isValid = false;
            }
        }

        setErrors(newErrors);
        setTouched(Object.keys(validationRules).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}));

        return isValid;
    }, [validateField, validationRules, values]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    const getFieldProps = useCallback((name) => ({
        name,
        value: values[name] || '',
        onChange: handleChange,
        onBlur: handleBlur,
        'aria-invalid': touched[name] && errors[name] ? 'true' : 'false',
    }), [values, handleChange, handleBlur, touched, errors]);

    const getFieldError = useCallback((name) => {
        return touched[name] ? errors[name] : null;
    }, [touched, errors]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        reset,
        getFieldProps,
        getFieldError,
        setValues,
        isValid: Object.keys(errors).every(key => !errors[key])
    };
}

export { validators };

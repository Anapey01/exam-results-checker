/**
 * Security Utilities
 * 
 * Input sanitization and XSS prevention utilities.
 * Use these when displaying any user-provided content.
 */

/**
 * Escape HTML entities to prevent XSS
 * Use when displaying user input as text
 * 
 * @param {string} str - String to sanitize
 * @returns {string} - Escaped string safe for HTML display
 */
export function escapeHtml(str) {
    if (!str) return '';
    if (typeof str !== 'string') return String(str);

    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    return str.replace(/[&<>"'`=/]/g, char => htmlEntities[char]);
}

/**
 * Sanitize a URL to prevent javascript: protocol attacks
 * 
 * @param {string} url - URL to sanitize
 * @returns {string} - Safe URL or empty string
 */
export function sanitizeUrl(url) {
    if (!url) return '';

    // Remove whitespace and lowercase for checking
    const trimmed = url.trim().toLowerCase();

    // Block dangerous protocols
    const dangerous = [
        'javascript:',
        'data:',
        'vbscript:',
        'file:'
    ];

    for (const protocol of dangerous) {
        if (trimmed.startsWith(protocol)) {
            // Only log in development
            if (import.meta.env.DEV) {
                console.warn('Blocked dangerous URL:', url);
            }
            return '';
        }
    }

    // Only allow http, https, mailto, tel, and relative URLs
    const safeProtocols = ['http://', 'https://', 'mailto:', 'tel:', '/', '#'];
    const isSafe = safeProtocols.some(p => trimmed.startsWith(p)) ||
        !trimmed.includes(':'); // Relative URLs without protocol

    return isSafe ? url : '';
}

/**
 * Sanitize phone number - only allow digits and + symbol
 * 
 * @param {string} phone - Phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
export function sanitizePhone(phone) {
    if (!phone) return '';
    return phone.replace(/[^\d+\s-]/g, '');
}

/**
 * Sanitize index number - only allow alphanumeric
 * 
 * @param {string} indexNo - Index number to sanitize
 * @returns {string} - Sanitized index number
 */
export function sanitizeIndexNumber(indexNo) {
    if (!indexNo) return '';
    return indexNo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Sanitize PIN/Serial - only allow alphanumeric and hyphens
 * 
 * @param {string} value - PIN or Serial to sanitize
 * @returns {string} - Sanitized value
 */
export function sanitizePinSerial(value) {
    if (!value) return '';
    return value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
}

/**
 * Validate and sanitize email
 * 
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email) {
    if (!email) return '';

    // Basic sanitization
    const sanitized = email.trim().toLowerCase();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Create safe text content from user input
 * Use for setting textContent instead of innerHTML
 * 
 * @param {string} text - User input text
 * @returns {string} - Safe text
 */
export function safeText(text) {
    if (!text) return '';

    // Normalize whitespace
    return String(text)
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 10000); // Limit length to prevent DoS
}

/**
 * Validate that a value is a safe number
 * Use for prices, quantities, etc.
 * 
 * @param {any} value - Value to check
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number|null} - Safe number or null
 */
export function safeNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
    const num = Number(value);

    if (isNaN(num) || !isFinite(num)) {
        return null;
    }

    if (num < min || num > max) {
        return null;
    }

    return num;
}

/**
 * Check if origin is allowed (for postMessage, etc.)
 * 
 * @param {string} origin - Origin to check
 * @returns {boolean} - Whether origin is trusted
 */
export function isTrustedOrigin(origin) {
    const trustedOrigins = [
        window.location.origin,
        'https://resultgate.com',
        'https://www.resultgate.com'
    ];

    return trustedOrigins.includes(origin);
}

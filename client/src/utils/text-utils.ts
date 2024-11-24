import DOMPurify from "dompurify";

/**
 * Sanitize a string with optional configuration.
 * @param {string} input - The string to sanitize.
 * @param {object} options - DOMPurify options (default: disallow all HTML).
 * @returns {string} The sanitized string.
 */
export function sanitize(input, options = { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) {
    return DOMPurify.sanitize(input, options);
}

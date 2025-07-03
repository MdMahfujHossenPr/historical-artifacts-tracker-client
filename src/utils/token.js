// File: src/utils/token.js

/**
 * @file Manages authentication tokens (e.g., JWTs) for client-side applications.
 *       Utilizes localStorage for persistent storage.
 */

const TOKEN_KEY = 'authToken'; // The key used to store the token in localStorage

/**
 * Retrieves the authentication token from localStorage.
 *
 * @returns {string | null} The authentication token if found, otherwise null.
 */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving token from localStorage:', error);
    // In a production environment, consider logging this error to a monitoring service.
    return null;
  }
}

/**
 * Stores the authentication token in localStorage.
 *
 * @param {string} token The authentication token to store.
 */
export function setToken(token) {
  if (!token || typeof token !== 'string') {
    console.warn('Attempted to set an invalid or empty token. Token must be a non-empty string.');
    return;
  }
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting token in localStorage:', error);
    // Handle potential localStorage full errors or security errors in strict environments.
    // For example, if localStorage is full, you might want to clear some old data or notify the user.
  }
}

/**
 * Removes the authentication token from localStorage.
 */
export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token from localStorage:', error);
  }
}

/**
 * Checks if a token exists in localStorage.
 * This is a convenience function, often used for checking authentication status.
 *
 * @returns {boolean} True if a token exists, false otherwise.
 */
export function hasToken() {
  return !!getToken();
}

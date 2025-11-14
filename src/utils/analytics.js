/**
 * Analytics utility for Manga Bot Game
 * Lightweight event logging for tracking user interactions
 */

// Initialize analytics array on window object
if (!window.__mangaAnalytics) {
  window.__mangaAnalytics = [];
}

/**
 * Track an analytics event
 * @param {string} eventName - Name of the event to track
 * @param {object} payload - Additional data to log with the event
 */
export function track(eventName, payload = {}) {
  if (!eventName || typeof eventName !== 'string') {
    console.warn('[Analytics] Invalid event name:', eventName);
    return;
  }

  // Create event object with timestamp
  const event = {
    name: eventName,
    timestamp: new Date().toISOString(),
    payload: { ...payload }
  };

  // Add to analytics array
  window.__mangaAnalytics.push(event);

  // Log to console in development
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    console.log('[Analytics]', eventName, payload);
  }

  // Optional: Send to external analytics service
  // This can be extended later to integrate with services like GA, Mixpanel, etc.
}

/**
 * Get all tracked events
 * @returns {Array} Array of all tracked events
 */
export function getEvents() {
  return [...window.__mangaAnalytics];
}

/**
 * Get events by name
 * @param {string} eventName - Name of the event to filter by
 * @returns {Array} Array of matching events
 */
export function getEventsByName(eventName) {
  return window.__mangaAnalytics.filter(event => event.name === eventName);
}

/**
 * Clear all tracked events
 */
export function clearEvents() {
  window.__mangaAnalytics = [];
  console.log('[Analytics] Events cleared');
}

/**
 * Get events count
 * @returns {number} Total number of tracked events
 */
export function getEventsCount() {
  return window.__mangaAnalytics.length;
}

/**
 * Export events as JSON string
 * @returns {string} JSON string of all events
 */
export function exportEvents() {
  return JSON.stringify(window.__mangaAnalytics, null, 2);
}

/**
 * Track page view
 * @param {string} pageName - Name of the page
 * @param {object} additionalData - Additional data to track
 */
export function trackPageView(pageName, additionalData = {}) {
  track('page_view', {
    page: pageName,
    url: window.location.href,
    referrer: document.referrer,
    ...additionalData
  });
}

/**
 * Track button click
 * @param {string} buttonName - Name/ID of the button
 * @param {object} additionalData - Additional data to track
 */
export function trackClick(buttonName, additionalData = {}) {
  track('click', {
    button: buttonName,
    ...additionalData
  });
}

/**
 * Track wallet interaction
 * @param {string} action - Action performed (connect, disconnect, etc.)
 * @param {object} additionalData - Additional data to track
 */
export function trackWallet(action, additionalData = {}) {
  track('wallet', {
    action,
    ...additionalData
  });
}

/**
 * Track game event
 * @param {string} action - Game action (start, end, purchase, etc.)
 * @param {object} additionalData - Additional data to track
 */
export function trackGame(action, additionalData = {}) {
  track('game', {
    action,
    ...additionalData
  });
}

/**
 * Track error
 * @param {string} errorMessage - Error message
 * @param {object} additionalData - Additional error context
 */
export function trackError(errorMessage, additionalData = {}) {
  track('error', {
    message: errorMessage,
    userAgent: navigator.userAgent,
    ...additionalData
  });
}

export default {
  track,
  getEvents,
  getEventsByName,
  clearEvents,
  getEventsCount,
  exportEvents,
  trackPageView,
  trackClick,
  trackWallet,
  trackGame,
  trackError
};

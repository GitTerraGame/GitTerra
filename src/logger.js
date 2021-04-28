// Set this to true to enable logging in all parts of the app
const DEBUG = false;

/**
 * Log message to console if DEBUGing is enabled
 *
 * @param string message
 */
export default function log(...params) {
  if (DEBUG) {
    console.log(...params);
  }
}

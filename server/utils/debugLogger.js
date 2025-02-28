/**
 * Debug logger utility for the application
 * Provides structured logging with color coding and optional data objects
 */

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
};

// Section-specific colors
const sectionColors = {
  SERVER: colors.cyan,
  AUTH: colors.magenta,
  LOGIN: colors.green,
  REGISTER: colors.blue,
  USER_MODEL: colors.yellow,
  PROFILE: colors.blue,
  DATABASE: colors.cyan,
  ERROR: colors.red,
  REQUEST: colors.dim,
  RESPONSE: colors.dim,
};

/**
 * Format the current timestamp
 * @returns {string} Formatted timestamp string
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * Main debug logging function
 * @param {string} section - The section/module where the log is coming from
 * @param {string} message - The message to log
 * @param {object|null} data - Optional data object to include in the log
 * @param {boolean} isError - Whether this is an error log
 */
const debugLog = (section, message, data = null, isError = false) => {
  // Skip logging in production unless specifically enabled
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_DEBUG_LOGS) {
    return;
  }
  
  const timestamp = getTimestamp();
  const sectionColor = sectionColors[section] || colors.white;
  const msgColor = isError ? colors.red : colors.reset;
  
  // Format the log line
  const logLine = `${colors.dim}[${timestamp}]${colors.reset} ${sectionColor}[${section}]${colors.reset} ${msgColor}${message}${colors.reset}`;
  
  // Output to console
  if (isError) {
    console.error(logLine);
  } else {
    console.log(logLine);
  }
  
  // Log additional data if provided
  if (data) {
    try {
      if (typeof data === 'object') {
        // Handle sensitive data (e.g., passwords)
        const sanitizedData = JSON.parse(JSON.stringify(data));
        if (sanitizedData.password) sanitizedData.password = '[REDACTED]';
        if (sanitizedData.token) sanitizedData.token = '[REDACTED]';
        
        // Pretty print the data
        console.log(`${colors.dim}[DATA] ${colors.reset}${JSON.stringify(sanitizedData, null, 2)}`);
      } else {
        console.log(`${colors.dim}[DATA] ${colors.reset}${data}`);
      }
    } catch (err) {
      console.error(`${colors.red}Error logging data: ${err.message}${colors.reset}`);
    }
  }
};

// Specialized loggers
const logError = (section, message, data = null) => {
  debugLog(section, message, data, true);
};

const logRequest = (req) => {
  const sanitizedHeaders = { ...req.headers };
  if (sanitizedHeaders.authorization) {
    sanitizedHeaders.authorization = sanitizedHeaders.authorization.substring(0, 20) + '...';
  }
  
  const sanitizedBody = req.body ? { ...req.body } : {};
  if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
  
  debugLog(
    'REQUEST', 
    `${req.method} ${req.url}`, 
    {
      headers: sanitizedHeaders,
      body: Object.keys(sanitizedBody).length > 0 ? sanitizedBody : null,
      query: Object.keys(req.query).length > 0 ? req.query : null,
      ip: req.ip
    }
  );
};

const logResponse = (req, status, data = null) => {
  debugLog(
    'RESPONSE',
    `${req.method} ${req.url} - ${status}`,
    data
  );
};

export { debugLog, logError, logRequest, logResponse };
export default debugLog;

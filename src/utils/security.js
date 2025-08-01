// Enhanced security middleware for sensitive operations
export const securityMiddleware = {
  // Rate limiting for uploads
  uploadRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 uploads per window
    message: 'Too many uploads, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Content validation
  validateUpload: (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];

    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }

    if (file.size > maxSize) {
      throw new Error('File too large');
    }

    // Additional security: Check file headers
    return validateFileHeaders(file);
  },

  // CSRF protection
  csrfProtection: {
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  },

  // Input sanitization
  sanitizeInput: (input) => {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },
};

// Monitoring for suspicious activity
export const securityMonitoring = {
  logSuspiciousActivity: (req, activity) => {
    const suspiciousEvent = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      activity,
      path: req.path,
      method: req.method,
    };

    // Log to security monitoring service
    console.warn('SECURITY ALERT:', suspiciousEvent);

    // Send to Sentry with high priority
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.withScope((scope) => {
        scope.setLevel('warning');
        scope.setTag('security', 'suspicious_activity');
        scope.setContext('security_event', suspiciousEvent);
        window.Sentry.captureMessage('Suspicious activity detected');
      });
    }
  },

  // Detect rapid-fire requests
  detectBruteForce: (ip, endpoint) => {
    const key = `${ip}:${endpoint}`;
    const attempts = securityMonitoring.attemptCache.get(key) || 0;

    if (attempts > 10) {
      return true; // Potential brute force
    }

    securityMonitoring.attemptCache.set(key, attempts + 1);
    setTimeout(() => {
      securityMonitoring.attemptCache.delete(key);
    }, 60000); // Reset after 1 minute

    return false;
  },

  attemptCache: new Map(),
};

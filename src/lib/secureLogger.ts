// Secure logging utility - prevents sensitive data exposure
// Only logs in development environment

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: any;
}

class SecureLogger {
  private isDevelopment = import.meta.env.DEV;

  // Sanitize data before logging
  private sanitize(data: any): any {
    if (typeof data === 'string') {
      // Remove potential sensitive patterns and URLs
      return data
        .replace(/Bearer\s+[A-Za-z0-9+/=]{20,}/g, 'Bearer [REDACTED]')
        .replace(/password["\s]*:[\s"]*[^",\s}]+/gi, 'password: [REDACTED]')
        .replace(/token["\s]*:[\s"]*[^",\s}]+/gi, 'token: [REDACTED]')
        .replace(/key["\s]*:[\s"]*[^",\s}]+/gi, 'key: [REDACTED]')
        .replace(/https?:\/\/[^\s"'<>]+/gi, '[URL REDACTED]'); // Remove all URLs
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: LogData = {};
      for (const [key, value] of Object.entries(data)) {
        // Skip sensitive keys
        if (this.isSensitiveKey(key)) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitize(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private isSensitiveKey(key: string): boolean {
    const sensitiveKeys = [
      'password', 'token', 'key', 'secret', 'auth', 'authorization',
      'bearer', 'apikey', 'api_key', 'private', 'credential'
    ];
    return sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
  }

  private log(level: LogLevel, message: string, data?: LogData) {
    if (!this.isDevelopment) return;

    const sanitizedData = data ? this.sanitize(data) : undefined;

    switch (level) {
      case 'info':
        console.info(`[SECURE LOG] ${message}`, sanitizedData);
        break;
      case 'warn':
        console.warn(`[SECURE LOG] ${message}`, sanitizedData);
        break;
      case 'error':
        console.error(`[SECURE LOG] ${message}`, sanitizedData);
        break;
      case 'debug':
        console.debug(`[SECURE LOG] ${message}`, sanitizedData);
        break;
    }
  }

  info(message: string, data?: LogData) {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogData) {
    this.log('warn', message, data);
  }

  error(message: string, data?: LogData) {
    this.log('error', message, data);
  }

  debug(message: string, data?: LogData) {
    this.log('debug', message, data);
  }

  // API-specific logging
  apiError(operation: string, error: any) {
    // Don't log network errors that would expose URLs in development
    if (import.meta.env.DEV) {
      const safeError = {
        message: error?.message || 'Unknown error',
        status: error?.cause?.status,
        code: error?.cause?.code,
        operation,
      };

      // Only log if it's not a network error that would expose sensitive URLs
      if (safeError.code !== 'ERR_NETWORK' && safeError.code !== 'ERR_FAILED') {
        this.error(`API ${operation} failed`, safeError);
      }
    }
  }

  // Auth-specific logging (very limited)
  authEvent(event: string) {
    if (!this.isDevelopment) return;
    this.info(`Auth: ${event}`);
  }
}

export const secureLogger = new SecureLogger();
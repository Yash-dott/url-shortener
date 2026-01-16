
import { type ValidationError } from '../types';
import { logger } from './logger';

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateShortcode = (shortcode: string): boolean => {
  const regex = /^[a-zA-Z0-9]{1,20}$/;
  return regex.test(shortcode);
};

export const validateUrls = (urls: Array<{ originalUrl: string; validityMinutes?: number; customShortcode?: string }>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  logger.info('Starting URL validation', { urlCount: urls.length });

  urls.forEach((url, index) => {
    if (!url.originalUrl) {
      errors.push({ field: `url-${index}`, message: 'URL is required' });
    } else if (!validateUrl(url.originalUrl)) {
      errors.push({ field: `url-${index}`, message: 'Invalid URL format' });
    }

    if (url.validityMinutes !== undefined) {
      if (!Number.isInteger(url.validityMinutes) || url.validityMinutes <= 0) {
        errors.push({ field: `validity-${index}`, message: 'Validity must be a positive integer' });
      }
    }

    if (url.customShortcode && !validateShortcode(url.customShortcode)) {
      errors.push({ field: `shortcode-${index}`, message: 'Shortcode must be alphanumeric and 1-20 characters' });
    }
  });

  logger.info('URL validation completed', { errorCount: errors.length });
  return errors;
};

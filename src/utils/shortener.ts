
import type{ ShortenedUrl, UrlCreationRequest, ClickData } from '../types';
import { logger } from './logger';

const STORAGE_KEY = 'affordmed_shortened_urls';

export const generateShortCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const isShortCodeUnique = (shortCode: string, existingUrls: ShortenedUrl[]): boolean => {
  return !existingUrls.some(url => url.shortCode === shortCode);
};

export const createShortenedUrls = (requests: UrlCreationRequest[]): ShortenedUrl[] => {
  logger.info('Creating shortened URLs', { requestCount: requests.length });
  
  const existingUrls = getShortenedUrls();
  const newUrls: ShortenedUrl[] = [];

  requests.forEach((request, index) => {
    let shortCode = request.customShortcode;
    
    if (!shortCode || !isShortCodeUnique(shortCode, [...existingUrls, ...newUrls])) {
      do {
        shortCode = generateShortCode();
      } while (!isShortCodeUnique(shortCode, [...existingUrls, ...newUrls]));
    }

    const validityMinutes = request.validityMinutes || 30;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validityMinutes * 60 * 1000);

    const shortenedUrl: ShortenedUrl = {
      id: `${Date.now()}-${index}`,
      originalUrl: request.originalUrl,
      shortCode,
      shortUrl: `https://url-shortener-8g5h.onrender.com/${shortCode}`,
      createdAt,
      expiresAt,
      validityMinutes,
      clicks: [],
      isExpired: false
    };

    newUrls.push(shortenedUrl);
    logger.info('Created shortened URL', { shortCode, originalUrl: request.originalUrl });
  });

  const allUrls = [...existingUrls, ...newUrls];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allUrls));
  
  logger.info('Saved URLs to storage', { totalCount: allUrls.length });
  return newUrls;
};

export const getShortenedUrls = (): ShortenedUrl[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const urls = JSON.parse(stored).map((url: any) => ({
      ...url,
      createdAt: new Date(url.createdAt),
      expiresAt: new Date(url.expiresAt),
      clicks: url.clicks?.map((click: any) => ({
        ...click,
        timestamp: new Date(click.timestamp)
      })) || []
    }));

    // Update expired status
    const now = new Date();
    urls.forEach((url: ShortenedUrl) => {
      url.isExpired = now > url.expiresAt;
    });

    return urls;
  } catch (error) {
    logger.error('Error retrieving URLs from storage', error);
    return [];
  }
};

export const recordClick = (shortCode: string): string | null => {
  logger.info('Recording click', { shortCode });
  
  const urls = getShortenedUrls();
  const url = urls.find(u => u.shortCode === shortCode);
  
  if (!url) {
    logger.warn('Short code not found', { shortCode });
    return null;
  }
  
  if (url.isExpired || new Date() > url.expiresAt) {
    logger.warn('Attempted to access expired URL', { shortCode });
    return null;
  }

  // Simulate geographical and source data
  const locations = ['New York, US', 'London, UK', 'Mumbai, IN', 'Tokyo, JP', 'Sydney, AU'];
  const sources = ['Direct', 'Google', 'Facebook', 'Twitter', 'Email', 'Other'];
  
  const clickData: ClickData = {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    source: sources[Math.floor(Math.random() * sources.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    userAgent: navigator.userAgent
  };

  url.clicks.push(clickData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  
  logger.info('Click recorded successfully', { shortCode, clickCount: url.clicks.length });
  return url.originalUrl;
};

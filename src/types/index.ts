
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  validityMinutes: number;
  clicks: ClickData[];
  isExpired: boolean;
}

export interface ClickData {
  id: string;
  timestamp: Date;
  source: string;
  location: string;
  userAgent?: string;
}

export interface UrlCreationRequest {
  originalUrl: string;
  validityMinutes?: number;
  customShortcode?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

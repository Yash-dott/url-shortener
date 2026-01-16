
import React, { useState } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import Navigation from '../components/Navigation';
import UrlShortenerForm from '../components/UrlShortenerForm';
import ShortenedUrlResults from '../components/ShortenedUrlResults';
import type{ UrlCreationRequest, ShortenedUrl } from '../types';
import { createShortenedUrls } from '../utils/shortener';
import { logger } from '../utils/logger';

const UrlShortenerPage: React.FC = () => {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateUrls = async (requests: UrlCreationRequest[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      logger.info('Creating URLs request started', { requestCount: requests.length });
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUrls = createShortenedUrls(requests);
      setShortenedUrls(newUrls);
      
      logger.info('URLs created successfully', { 
        createdCount: newUrls.length,
        shortCodes: newUrls.map(url => url.shortCode)
      });
      
    } catch (err) {
      const errorMessage = 'Failed to create shortened URLs. Please try again.';
      setError(errorMessage);
      logger.error('URL creation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            URL Shortener
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Create up to 5 shortened URLs with custom settings and detailed analytics
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <UrlShortenerForm onSubmit={handleCreateUrls} isLoading={isLoading} />
        <ShortenedUrlResults urls={shortenedUrls} />
      </Container>
    </Box>
  );
};

export default UrlShortenerPage;

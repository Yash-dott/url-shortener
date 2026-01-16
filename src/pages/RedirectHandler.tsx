
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { Launch, Home } from '@mui/icons-material';
import { recordClick } from '../utils/shortener';
import { logger } from '../utils/logger';

const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short code');
      setLoading(false);
      return;
    }

    logger.info('Processing redirect request', { shortCode });

    const originalUrl = recordClick(shortCode);
    
    if (originalUrl) {
      logger.info('Redirect successful', { shortCode, originalUrl });
      setRedirectUrl(originalUrl);
      
      // Redirect after a brief delay to show loading state
      setTimeout(() => {
        window.location.href = originalUrl;
      }, 1500);
    } else {
      const errorMsg = 'Short URL not found or has expired';
      logger.warn('Redirect failed', { shortCode, error: errorMsg });
      setError(errorMsg);
    }
    
    setLoading(false);
  }, [shortCode]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          Redirecting...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we redirect you to your destination
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        px: 3
      }}>
        <Alert severity="error" sx={{ mb: 4, maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body2">
            {error}. The link may have expired or the short code is invalid.
          </Typography>
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<Home />}
            href="/"
            size="large"
          >
            Go to Homepage
          </Button>
          <Button
            variant="outlined"
            href="/statistics"
            size="large"
          >
            View Statistics
          </Button>
        </Box>
      </Box>
    );
  }

  if (redirectUrl) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        px: 3
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#2e7d32' }}>
          ✅ Redirect Successful!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          You should be automatically redirected to:
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4, 
            wordBreak: 'break-all', 
            textAlign: 'center',
            color: '#1976d2'
          }}
        >
          {redirectUrl}
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4, maxWidth: 500 }}>
          <Typography variant="body2">
            If the redirect doesn't work automatically, click the button below to visit the original URL manually.
          </Typography>
        </Alert>

        <Button
          variant="contained"
          startIcon={<Launch />}
          onClick={() => window.open(redirectUrl, '_blank')}
          size="large"
        >
          Visit Original URL
        </Button>
      </Box>
    );
  }

  return <Navigate to="/" replace />;
};

export default RedirectHandler;

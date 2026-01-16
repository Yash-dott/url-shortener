
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import Navigation from '../components/Navigation';
import StatisticsTable from '../components/StatisticsTable';
import type { ShortenedUrl } from '../types';
import { getShortenedUrls } from '../utils/shortener';
import { logger } from '../utils/logger';

const StatisticsPage: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUrls = () => {
    setLoading(true);
    logger.info('Loading URLs for statistics page');

    try {
      const loadedUrls = getShortenedUrls();
      setUrls(loadedUrls);
      logger.info('URLs loaded successfully', { count: loadedUrls.length });
    } catch (error) {
      logger.error('Error loading URLs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
  const activeUrls = urls.filter(url => !url.isExpired).length;
  const expiredUrls = urls.filter(url => url.isExpired).length;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            URL Statistics
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Comprehensive analytics for all your shortened URLs
          </Typography>
        </Box>

        {/* Summary Stats */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {urls.length}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total URLs
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              {activeUrls}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Active URLs
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
              {expiredUrls}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Expired URLs
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              {totalClicks}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Total Clicks
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadUrls}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>

        <StatisticsTable urls={urls} />

        {urls.length > 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Click data includes simulated geographical locations and traffic sources for demonstration purposes.
              In a production environment, this would be replaced with actual geolocation and referrer tracking.
            </Typography>
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default StatisticsPage;

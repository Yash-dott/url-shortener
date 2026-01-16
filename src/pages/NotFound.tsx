
import React from "react";
import { Box, Typography, Button, Container } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logger } from '../utils/logger';

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    logger.error("404 Error: User attempted to access non-existent route", {
      pathname: location.pathname,
      search: location.search
    });
  }, [location.pathname, location.search]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ 
            fontSize: '8rem', 
            fontWeight: 'bold', 
            color: '#1976d2',
            mb: 2 
          }}>
            404
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Page Not Found
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Oops! The page you're looking for doesn't exist or may have been moved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              startIcon={<Home />}
              href="/"
              size="large"
              sx={{ minWidth: 150 }}
            >
              Go Home
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />}
              onClick={() => window.history.back()}
              size="large"
              sx={{ minWidth: 150 }}
            >
              Go Back
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            If you believe this is an error, please contact support.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;

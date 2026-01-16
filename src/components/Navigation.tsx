
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { logger } from '../utils/logger';

const Navigation: React.FC = () => {
  const location = useLocation();

  const handleNavigation = (path: string) => {
    logger.info('Navigation clicked', { from: location.pathname, to: path });
  };

  return (
    <AppBar position="static" sx={{ mb: 4, backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          AffordMed URL Shortener
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            onClick={() => handleNavigation('/')}
            sx={{ 
              fontWeight: location.pathname === '/' ? 'bold' : 'normal',
              textDecoration: location.pathname === '/' ? 'underline' : 'none'
            }}
          >
            Shortener
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/statistics"
            onClick={() => handleNavigation('/statistics')}
            sx={{ 
              fontWeight: location.pathname === '/statistics' ? 'bold' : 'normal',
              textDecoration: location.pathname === '/statistics' ? 'underline' : 'none'
            }}
          >
            Statistics
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;

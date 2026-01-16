
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  Divider
} from '@mui/material';
import { ContentCopy, Launch } from '@mui/icons-material';
import type { ShortenedUrl } from '../types';
import { logger } from '../utils/logger';

interface Props {
  urls: ShortenedUrl[];
}

const ShortenedUrlResults: React.FC<Props> = ({ urls }) => {
  const copyToClipboard = (text: string, shortCode: string) => {
    navigator.clipboard.writeText(text).then(() => {
      logger.info('Copied to clipboard', { shortCode, text });
    }).catch(() => {
      logger.error('Failed to copy to clipboard', { shortCode, text });
    });
  };

  const openUrl = (url: string, shortCode: string) => {
    logger.info('Opening original URL', { shortCode, url });
    window.open(url, '_blank');
  };

  if (urls.length === 0) return null;

  return (
    <Card elevation={3} sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
          ✅ URLs Successfully Created
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your shortened URLs are ready! Click to copy or visit the original URLs.
        </Typography>

        {urls.map((url, index) => (
          <Box key={url.id} sx={{ mb: 3 }}>
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                URL #{index + 1}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    value={url.originalUrl}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{ backgroundColor: 'white' }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Launch />}
                    onClick={() => openUrl(url.originalUrl, url.shortCode)}
                  >
                    Visit
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Shortened URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    value={url.shortUrl}
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                    sx={{ backgroundColor: 'white' }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={() => copyToClipboard(url.shortUrl, url.shortCode)}
                  >
                    Copy
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Chip 
                  label={`Code: ${url.shortCode}`} 
                  variant="outlined" 
                  size="small" 
                />
                <Chip 
                  label={`Expires: ${url.expiresAt.toLocaleString()}`} 
                  color="warning" 
                  variant="outlined" 
                  size="small" 
                />
                <Chip 
                  label={`Valid for: ${url.validityMinutes} min`} 
                  color="info" 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
            </Box>
            
            {index < urls.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}

        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Success!</strong> {urls.length} URL{urls.length > 1 ? 's' : ''} created successfully. 
            You can now share these links or view detailed statistics on the Statistics page.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default ShortenedUrlResults;

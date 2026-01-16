
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  IconButton,
  Divider
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import type {  UrlCreationRequest, ValidationError } from '../types';
import { validateUrls } from '../utils/validation';
import { logger } from '../utils/logger';

interface UrlFormData {
  originalUrl: string;
  validityMinutes: string;
  customShortcode: string;
}

interface Props {
  onSubmit: (requests: UrlCreationRequest[]) => void;
  isLoading: boolean;
}

const UrlShortenerForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [urls, setUrls] = useState<UrlFormData[]>([
    { originalUrl: '', validityMinutes: '', customShortcode: '' }
  ]);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { originalUrl: '', validityMinutes: '', customShortcode: '' }]);
      logger.info('Added URL field', { totalFields: urls.length + 1 });
    }
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      logger.info('Removed URL field', { removedIndex: index, totalFields: newUrls.length });
    }
  };

  const updateUrl = (index: number, field: keyof UrlFormData, value: string) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
    
    // Clear related errors when user starts typing
    setErrors(errors.filter(error => !error.field.endsWith(`-${index}`)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logger.info('Form submission started', { urlCount: urls.length });

    const requests: UrlCreationRequest[] = urls
      .filter(url => url.originalUrl.trim())
      .map(url => ({
        originalUrl: url.originalUrl.trim(),
        validityMinutes: url.validityMinutes ? parseInt(url.validityMinutes) : undefined,
        customShortcode: url.customShortcode.trim() || undefined
      }));

    const validationErrors = validateUrls(requests);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      logger.warn('Form validation failed', { errors: validationErrors });
      return;
    }

    setErrors([]);
    onSubmit(requests);
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Create Shortened URLs
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter up to 5 URLs to shorten. Default validity is 30 minutes if not specified.
        </Typography>

        <form onSubmit={handleSubmit}>
          {urls.map((url, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  URL #{index + 1}
                </Typography>
                {urls.length > 1 && (
                  <IconButton 
                    onClick={() => removeUrlField(index)}
                    color="error"
                    size="small"
                  >
                    <Remove />
                  </IconButton>
                )}
              </Box>

              <TextField
                fullWidth
                label="Original URL"
                placeholder="https://example.com"
                value={url.originalUrl}
                onChange={(e) => updateUrl(index, 'originalUrl', e.target.value)}
                error={!!getFieldError(`url-${index}`)}
                helperText={getFieldError(`url-${index}`)}
                sx={{ mb: 2 }}
                required
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Validity (minutes)"
                  type="number"
                  placeholder="30"
                  value={url.validityMinutes}
                  onChange={(e) => updateUrl(index, 'validityMinutes', e.target.value)}
                  error={!!getFieldError(`validity-${index}`)}
                  helperText={getFieldError(`validity-${index}`) || 'Default: 30 minutes'}
                  sx={{ flex: 1 }}
                />

                <TextField
                  label="Custom Shortcode (optional)"
                  placeholder="mycode123"
                  value={url.customShortcode}
                  onChange={(e) => updateUrl(index, 'customShortcode', e.target.value)}
                  error={!!getFieldError(`shortcode-${index}`)}
                  helperText={getFieldError(`shortcode-${index}`) || 'Alphanumeric, 1-20 chars'}
                  sx={{ flex: 1 }}
                />
              </Box>

              {index < urls.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Box>
              {urls.length < 5 && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addUrlField}
                  sx={{ mr: 2 }}
                >
                  Add URL ({urls.length}/5)
                </Button>
              )}
              
              {urls.length === 5 && (
                <Chip 
                  label="Maximum 5 URLs reached" 
                  color="info" 
                  variant="outlined" 
                />
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading || !urls.some(url => url.originalUrl.trim())}
              sx={{ minWidth: 150 }}
            >
              {isLoading ? 'Creating...' : 'Create Short URLs'}
            </Button>
          </Box>
        </form>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Please fix the following errors:
            </Typography>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2">
                • {error.message}
              </Typography>
            ))}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlShortenerForm;

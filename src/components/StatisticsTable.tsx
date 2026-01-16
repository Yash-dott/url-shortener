
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Collapse,
  IconButton,
  TextField,
  Alert
} from '@mui/material';
import { 
  ExpandMore, 
  ExpandLess, 
  ContentCopy, 
  Launch,
  AccessTime,
  LocationOn,
  Source
} from '@mui/icons-material';
import type{ ShortenedUrl } from '../types';
import { logger } from '../utils/logger';

interface Props {
  urls: ShortenedUrl[];
}

const StatisticsTable: React.FC<Props> = ({ urls }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (urlId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(urlId)) {
      newExpanded.delete(urlId);
    } else {
      newExpanded.add(urlId);
    }
    setExpandedRows(newExpanded);
    logger.info('Toggled row expansion', { urlId, expanded: !expandedRows.has(urlId) });
  };

  const copyToClipboard = (text: string, shortCode: string) => {
    navigator.clipboard.writeText(text).then(() => {
      logger.info('Copied to clipboard from statistics', { shortCode, text });
    }).catch(() => {
      logger.error('Failed to copy to clipboard from statistics', { shortCode, text });
    });
  };

  const openUrl = (url: string, shortCode: string) => {
    logger.info('Opening URL from statistics', { shortCode, url });
    window.open(url, '_blank');
  };

  if (urls.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No URLs Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create some shortened URLs to see statistics here.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          URL Statistics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Detailed analytics for all your shortened URLs
        </Typography>

        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell />
                <TableCell><strong>Short URL</strong></TableCell>
                <TableCell><strong>Original URL</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell><strong>Expires</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Clicks</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <React.Fragment key={url.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRowExpansion(url.id)}
                      >
                        {expandedRows.has(url.id) ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          value={url.shortUrl}
                          variant="outlined"
                          size="small"
                          InputProps={{ readOnly: true }}
                          sx={{ minWidth: 200 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(url.shortUrl, url.shortCode)}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={url.originalUrl}
                      >
                        {url.originalUrl}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {url.createdAt.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {url.expiresAt.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={url.isExpired ? 'Expired' : 'Active'}
                        color={url.isExpired ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={url.clicks.length}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<Launch />}
                        onClick={() => openUrl(url.originalUrl, url.shortCode)}
                      >
                        Visit
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={8} sx={{ py: 0 }}>
                      <Collapse in={expandedRows.has(url.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                            Click Details ({url.clicks.length} total clicks)
                          </Typography>
                          
                          {url.clicks.length === 0 ? (
                            <Alert severity="info" sx={{ mt: 2 }}>
                              No clicks recorded yet for this URL.
                            </Alert>
                          ) : (
                            <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
                              <Table size="small">
                                <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                                  <TableRow>
                                    <TableCell><strong>Timestamp</strong></TableCell>
                                    <TableCell><strong>Source</strong></TableCell>
                                    <TableCell><strong>Location</strong></TableCell>
                                    <TableCell><strong>User Agent</strong></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {url.clicks.map((click) => (
                                    <TableRow key={click.id} hover>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <AccessTime fontSize="small" color="action" />
                                          {click.timestamp.toLocaleString()}
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Source fontSize="small" color="action" />
                                          <Chip label={click.source} size="small" variant="outlined" />
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <LocationOn fontSize="small" color="action" />
                                          {click.location}
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Typography 
                                          variant="body2" 
                                          color="text.secondary"
                                          sx={{ 
                                            maxWidth: 200, 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}
                                          title={click.userAgent || 'N/A'}
                                        >
                                          {click.userAgent || 'N/A'}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default StatisticsTable;

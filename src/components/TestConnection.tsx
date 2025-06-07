import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, Button } from '@mui/material';

const TestConnection: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    try {
      setStatus('Testing connection...');
      setError('');
      
      // Test basic endpoint
      const response = await api.get('/test');
      console.log('Test response:', response.data);
      setStatus('Backend is accessible: ' + response.data.message);

      // Test inventory endpoint
      const inventoryResponse = await api.get('/inventory/test');
      console.log('Inventory test response:', inventoryResponse.data);
      setStatus(prev => prev + '\nInventory endpoint is accessible');
    } catch (error: any) {
      console.error('Connection test error:', error);
      setError(error.message || 'Failed to connect to backend');
      if (error.response) {
        console.log('Error response:', error.response.data);
        console.log('Error status:', error.response.status);
      }
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Backend Connection Test
      </Typography>
      {status && (
        <Typography color="primary" paragraph>
          {status}
        </Typography>
      )}
      {error && (
        <Typography color="error" paragraph>
          Error: {error}
        </Typography>
      )}
      <Button variant="contained" onClick={testConnection}>
        Test Again
      </Button>
    </Box>
  );
};

export default TestConnection; 
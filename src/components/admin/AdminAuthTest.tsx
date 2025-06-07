import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

const AdminAuthTest: React.FC = () => {
    const [authStatus, setAuthStatus] = useState<{
        success?: boolean;
        message?: string;
        error?: string;
        user?: {
            id: string;
            email: string;
            role: string;
        };
    }>({});

    useEffect(() => {
        const testAdminAuth = async () => {
            try {
                // Log current auth state
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                console.log('Current auth state:', { token: !!token, user });

                const response = await api.get(API_ENDPOINTS.ADD_VEHICLE.replace('/add-vehicle', '/test-admin'));
                console.log('Admin test response:', response.data);
                
                setAuthStatus({
                    success: true,
                    message: response.data.message,
                    user: response.data.user
                });
            } catch (error: any) {
                console.error('Admin test error:', error.response || error);
                setAuthStatus({
                    success: false,
                    error: error.response?.data?.message || 'Failed to verify admin access'
                });
            }
        };

        testAdminAuth();
    }, []);

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Admin Authentication Test
            </Typography>
            
            {authStatus.success ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {authStatus.message}
                    {authStatus.user && (
                        <Box component="pre" sx={{ mt: 1 }}>
                            {JSON.stringify(authStatus.user, null, 2)}
                        </Box>
                    )}
                </Alert>
            ) : authStatus.error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {authStatus.error}
                </Alert>
            ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Testing admin authentication...
                </Alert>
            )}
        </Box>
    );
};

export default AdminAuthTest; 
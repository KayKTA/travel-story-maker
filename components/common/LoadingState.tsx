'use client';

import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

interface LoadingStateProps {
    message?: string;
    variant?: 'spinner' | 'skeleton';
    height?: number | string;
}

export default function LoadingState({
    message = 'Chargement...',
    variant = 'spinner',
    height = 300,
}: LoadingStateProps) {
    if (variant === 'skeleton') {
        return (
            <Box sx={{ width: '100%' }}>
                <Skeleton variant="rounded" height={height} sx={{ borderRadius: 3 }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height,
                gap: 2,
            }}
        >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
}

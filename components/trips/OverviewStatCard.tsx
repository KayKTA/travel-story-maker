'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface OverviewStatCardProps {
    value: ReactNode;
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'error';
    onClick?: () => void;
}

const colorMap = {
    default: { text: '#1A1A1A', hover: 'rgba(26, 26, 26, 0.03)' },
    primary: { text: '#1A1A1A', hover: 'rgba(26, 26, 26, 0.05)' },
    secondary: { text: '#D64545', hover: 'rgba(214, 69, 69, 0.05)' },
    success: { text: '#2D5A3D', hover: 'rgba(45, 90, 61, 0.05)' },
    error: { text: '#D64545', hover: 'rgba(214, 69, 69, 0.05)' },
};

export default function OverviewStatCard({
    value,
    label,
    color = 'default',
    onClick,
}: OverviewStatCardProps) {
    const colors = colorMap[color];

    return (
        <Card
            onClick={onClick}
            sx={{
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                '&:hover': onClick
                    ? {
                        bgcolor: colors.hover,
                        transform: 'translateY(-2px)',
                    }
                    : undefined,
            }}
        >
            <CardContent sx={{ textAlign: 'center', py: { xs: 2, sm: 3 } }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 800, color: colors.text }}
                >
                    {value}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {label}
                </Typography>
            </CardContent>
        </Card>
    );
}

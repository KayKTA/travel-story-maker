'use client';

import { Box, Typography, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { tokens, flexStart } from '@/styles';

interface StatItemProps {
    icon: ReactNode;
    value: string | number;
    label?: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'error';
    sx?: SxProps<Theme>;
}

export default function StatItem({
    icon,
    value,
    label,
    color = 'default',
    sx,
}: StatItemProps) {
    return (
        <Box sx={{ ...flexStart, gap: 0.5, ...sx }}>
            <Box sx={{ color: 'action.active', display: 'flex' }}>
                {icon}
            </Box>
            <Typography variant="body2" color="text.secondary">
                {value}
                {label && ` ${label}`}
            </Typography>
        </Box>
    );
}

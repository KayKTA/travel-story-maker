'use client';

import { Chip, ChipProps } from '@mui/material';
import { ReactNode } from 'react';
import { tokens } from '@/styles';

interface IconChipProps extends Omit<ChipProps, 'variant' | 'icon'> {
    icon: ReactNode;
    variant?: 'filled' | 'outlined' | 'subtle';
}

export default function IconChip({
    icon,
    variant = 'filled',
    sx,
    ...props
}: IconChipProps) {
    const variantStyles = {
        filled: {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '& .MuiChip-icon': { color: 'primary.contrastText', fontSize: 16 },
        },
        outlined: {
            bgcolor: 'transparent',
            border: 2,
            borderColor: 'primary.main',
            color: 'primary.main',
            '& .MuiChip-icon': { color: 'primary.main', fontSize: 16 },
        },
        subtle: {
            bgcolor: 'action.hover',
            color: 'text.primary',
            '& .MuiChip-icon': { color: 'text.secondary', fontSize: 16 },
        },
    };

    return (
        <Chip
            icon={icon as any}
            size="small"
            sx={{
                fontWeight: tokens.fontWeights.bold,
                height: tokens.components.chip.height,
                '& .MuiChip-label': { px: 1, fontSize: '0.8rem' },
                // '& .MuiChip-icon': { fontSize: 16 },
                ...variantStyles[variant],
                ...sx,
            }}
            {...props}
        />
    );
}

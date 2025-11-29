'use client';

import { Chip, ChipProps } from '@mui/material';
import { tokens } from '@/styles';

interface CountBadgeProps extends Omit<ChipProps, 'label' | 'variant'> {
    count: number;
    singular?: string;
    plural?: string;
    variant?: 'primary' | 'secondary' | 'default';
}

const variantStyles = {
    primary: {
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
    },
    secondary: {
        bgcolor: 'secondary.main',
        color: 'secondary.contrastText',
    },
    default: {
        bgcolor: 'action.selected',
        color: 'text.primary',
    },
};

export default function CountBadge({
    count,
    singular = '',
    plural = '',
    variant = 'primary',
    sx,
    ...props
}: CountBadgeProps) {
    const label = plural
        ? `${count} ${count === 1 ? singular : plural}`
        : count.toString();

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                ...variantStyles[variant],
                fontWeight: tokens.fontWeights.bold,
                ...sx,
            }}
            {...props}
        />
    );
}

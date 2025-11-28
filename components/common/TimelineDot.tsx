'use client';

import { Box, Typography } from '@mui/material';
import { tokens } from '@/styles';

interface TimelineDotProps {
    index: number;
    color?: string;
    isSelected?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const sizes = {
    sm: { width: 20, height: 20, fontSize: 10 },
    md: { width: 24, height: 24, fontSize: 11 },
    lg: { width: 28, height: 28, fontSize: 12 },
};

export default function TimelineDot({
    index,
    color,
    isSelected = false,
    size = 'md',
}: TimelineDotProps) {
    const sizeConfig = sizes[size];
    const dotWidth = isSelected ? sizeConfig.width + 4 : sizeConfig.width;
    const dotHeight = isSelected ? sizeConfig.height + 4 : sizeConfig.height;

    return (
        <Box
            sx={{
                width: dotWidth,
                height: dotHeight,
                borderRadius: '50%',
                bgcolor: color || 'primary.main',
                border: '3px solid',
                borderColor: 'background.paper',
                boxShadow: isSelected
                    ? (theme) => `0 0 0 3px ${theme.palette.primary.main}`
                    : '0 1px 3px rgba(0,0,0,0.2)',
                transition: tokens.transitions.fast,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography
                sx={{
                    fontSize: isSelected ? sizeConfig.fontSize + 1 : sizeConfig.fontSize,
                    fontWeight: tokens.fontWeights.bold,
                    color: 'common.white',
                    lineHeight: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
            >
                {index}
            </Typography>
        </Box>
    );
}

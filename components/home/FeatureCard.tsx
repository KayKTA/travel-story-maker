'use client';

import { Box, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                minHeight: 96,
                borderRadius: theme.shape.borderRadius, // léger arrondi
                // border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.default,
                boxShadow: theme.shadows[2],
            }}
        >

            <Stack
                spacing={1.5}
                alignItems="center"
                sx={{
                    textAlign: 'center',
                    px: { xs: 1, md: 2 },
                }}
            >
                {/* “Logo” / illustration */}
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.main,
                        mb: 0.5,
                    }}
                >
                    {icon}
                </Box>

                {/* Titre */}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 600,
                        letterSpacing: '-0.01em',
                    }}
                >
                    {title}
                </Typography>

                {/* Sous-texte */}
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        maxWidth: 260,
                        fontSize: '0.85rem',
                    }}
                >
                    {description}
                </Typography>
            </Stack>
        </Box>
    );
}

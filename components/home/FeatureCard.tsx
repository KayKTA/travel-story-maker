'use client';

import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { alpha } from '@mui/material/styles';

interface FeatureCardProps {
    imageSrc: string;
    title: string;
    description: string;
    blobVariant?: number; // pour varier la forme du blob
}

export default function FeatureCard({
    imageSrc,
    title,
    description,
    blobVariant = 0,
}: FeatureCardProps) {
    const theme = useTheme();

    const blobShapes = [
        '60% 40% 50% 70% / 55% 60% 40% 45%',
        '45% 55% 65% 35% / 40% 60% 50% 60%',
        '55% 45% 60% 40% / 60% 40% 60% 40%',
    ];
    const shape = blobShapes[blobVariant % blobShapes.length];

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                px: 2,
                py: 3,
                borderRadius: 3,
                // bgcolor: 'background.paper',
                // boxShadow: 1,
                // transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                // '&:hover': {
                //     transform: 'translateY(-4px)',
                //     boxShadow: 3,
                // },
                '&:hover .feature-blob-wrapper': {
                    transform: 'translateY(-2px) scale(1.04)',
                },
                '&:hover .feature-blob-wrapper::before': {
                    opacity: 0.75,
                    // transform: 'scale(1.08) rotate(2deg)',
                },
            }}
        >
            {/* BLOB + IMAGE */}
            <Box
                className="feature-blob-wrapper"
                sx={{
                    position: 'relative',
                    width: 112,
                    height: 112,
                    mb: 2,
                    transition: 'transform 0.35s ease',
                    '&::before': (theme) => ({
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: shape,
                        background: theme.palette.primary.light,
                        opacity: 0.45,
                        filter: 'blur(1px)',
                        transform: 'scale(1.02)',
                        transition: 'transform 0.35s ease',
                    }),
                }}
            >
                {/* Zone pour l'illustration avec padding interne */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 20, // padding between blob edge and image
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                    }}
                >
                    <Image
                        src={`/images/features/${imageSrc}`}
                        alt={title}
                        fill
                        style={{
                            objectFit: 'contain',
                        }}
                    />
                </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 260 }}
            >
                {description}
            </Typography>
        </Box>
    );
}

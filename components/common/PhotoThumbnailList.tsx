'use client';

import { Box, Typography } from '@mui/material';
import { tokens } from '@/styles';
import type { MediaAsset } from '@/types';

interface PhotoThumbnailListProps {
    photos: MediaAsset[];
    maxVisible?: number;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const sizes = {
    sm: 32,
    md: 40,
    lg: 48,
};

export default function PhotoThumbnailList({
    photos,
    maxVisible = 3,
    size = 'md',
    onClick,
}: PhotoThumbnailListProps) {
    if (photos.length === 0) return null;

    const visiblePhotos = photos.slice(0, maxVisible);
    const remaining = photos.length - maxVisible;
    const thumbnailSize = sizes[size];

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 0.5,
                cursor: onClick ? 'pointer' : 'default',
            }}
            onClick={onClick}
        >
            {visiblePhotos.map((photo) => (
                <Box
                    key={photo.id}
                    component="img"
                    src={photo.thumbnail_url || photo.url}
                    alt=""
                    sx={{
                        width: thumbnailSize,
                        height: thumbnailSize,
                        objectFit: 'cover',
                        borderRadius: 1,
                    }}
                />
            ))}
            {remaining > 0 && (
                <Box
                    sx={{
                        width: thumbnailSize,
                        height: thumbnailSize,
                        borderRadius: 1,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{ fontWeight: tokens.fontWeights.bold }}
                    >
                        +{remaining}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

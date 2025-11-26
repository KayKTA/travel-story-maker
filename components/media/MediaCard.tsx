'use client';

import { Box, Typography, Chip } from '@mui/material';
import {
    PlayArrow as PlayIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import { formatDuration } from '@/lib/utils/formatters';
import type { MediaAsset } from '@/types';

interface MediaCardProps {
    media: MediaAsset;
    onClick?: () => void;
}

export default function MediaCard({ media, onClick }: MediaCardProps) {
    const isVideo = media.media_type === 'video';
    const hasLocation = media.lat !== null && media.lng !== null;

    return (
        <Box
            onClick={onClick}
            sx={{
                position: 'relative',
                paddingTop: '100%', // 1:1 aspect ratio
                borderRadius: 2,
                overflow: 'hidden',
                cursor: onClick ? 'pointer' : 'default',
                bgcolor: 'grey.200',
                '&:hover': onClick
                    ? {
                        '& .media-overlay': {
                            opacity: 1,
                        },
                        transform: 'scale(1.02)',
                    }
                    : {},
                transition: 'transform 0.2s',
            }}
        >
            {/* Thumbnail */}
            <Box
                component="img"
                src={media.thumbnail_url || media.url}
                alt={media.caption || 'Media'}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />

            {/* Video play icon */}
            {isVideo && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <PlayIcon sx={{ fontSize: 32 }} />
                </Box>
            )}

            {/* Video duration badge */}
            {isVideo && media.duration_seconds && (
                <Chip
                    label={formatDuration(media.duration_seconds)}
                    size="small"
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        fontSize: '0.75rem',
                    }}
                />
            )}

            {/* Location indicator */}
            {hasLocation && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        p: 0.5,
                        borderRadius: 1,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <LocationIcon fontSize="small" />
                </Box>
            )}

            {/* Hover overlay */}
            {onClick && (
                <Box
                    className="media-overlay"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0,0,0,0.3)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'flex-end',
                        p: 1.5,
                    }}
                >
                    {media.caption && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'white',
                                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {media.caption}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

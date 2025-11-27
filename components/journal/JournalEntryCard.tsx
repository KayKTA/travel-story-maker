'use client';

import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Stack,
    IconButton,
    Collapse,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    ExpandMore as ExpandMoreIcon,
    Videocam as VideoIcon,
    Mic as MicIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { formatDateLong, parseTags } from '@/lib/utils/formatters';
import { JOURNAL_MOODS } from '@/types/journal';
import type { JournalEntryWithMedia } from '@/types';

interface JournalEntryCardProps {
    entry: JournalEntryWithMedia;
}

export default function JournalEntryCard({ entry }: JournalEntryCardProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [expanded, setExpanded] = useState(false);

    const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
    const tags = parseTags(entry.tags);
    const photos = entry.media_assets?.filter((m) => m.media_type === 'photo') || [];
    const videos = entry.media_assets?.filter((m) => m.media_type === 'video') || [];
    const hasMedia = photos.length > 0 || videos.length > 0;
    const isTranscribed = entry.content_source === 'audio_transcription';

    // Determine mood badge colors
    const getMoodColors = () => {
        if (!moodData) return { bg: '#1A1A1A', text: '#F5B82E' };
        const lightMoods = ['happy', 'mixed'];
        if (lightMoods.includes(moodData.value)) {
            return { bg: moodData.color, text: '#1A1A1A' };
        }
        return { bg: moodData.color, text: '#FFFFFF' };
    };

    const moodColors = getMoodColors();

    return (
        <Card
            sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: { xs: 'none', sm: 'translateY(-2px)' },
                    boxShadow: 4,
                },
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                    {/* Row 1: Date + Mood + Expand */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 1,
                        }}
                    >
                        <Typography
                            variant={isMobile ? 'body1' : 'h6'}
                            sx={{ fontWeight: 700 }}
                        >
                            {formatDateLong(entry.entry_date)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {moodData && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 50,
                                        bgcolor: moodColors.bg,
                                        color: moodColors.text,
                                    }}
                                >
                                    <Typography sx={{ fontSize: 16 }}>{moodData.emoji}</Typography>
                                    {!isMobile && (
                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                            {moodData.label}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            {hasMedia && (
                                <IconButton
                                    onClick={() => setExpanded(!expanded)}
                                    size="small"
                                    sx={{
                                        transform: expanded ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.2s',
                                    }}
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {/* Row 2: Location + badges */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        {entry.location && (
                            <Chip
                                icon={<LocationIcon sx={{ fontSize: '16px !important' }} />}
                                label={entry.location}
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 26,
                                    borderWidth: 2,
                                    fontWeight: 600,
                                    '& .MuiChip-label': { px: 1 },
                                }}
                            />
                        )}

                        {isTranscribed && (
                            <Chip
                                icon={<MicIcon sx={{ fontSize: '14px !important' }} />}
                                label={isMobile ? '' : 'Transcrit'}
                                size="small"
                                sx={{
                                    height: 26,
                                    bgcolor: 'rgba(26, 26, 26, 0.1)',
                                    '& .MuiChip-label': { px: isMobile ? 0 : 1 },
                                }}
                            />
                        )}

                        {entry.trip && (
                            <Chip
                                label={entry.trip.country}
                                size="small"
                                sx={{
                                    height: 26,
                                    bgcolor: '#1A1A1A',
                                    color: '#F5B82E',
                                    fontWeight: 700,
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {/* Content */}
                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        mb: 2,
                        color: 'text.primary',
                        lineHeight: 1.7,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        ...(isMobile && hasMedia && !expanded && {
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }),
                    }}
                >
                    {entry.content}
                </Typography>

                {/* Tags */}
                {tags.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.5,
                            flexWrap: 'wrap',
                            mb: 2,
                        }}
                    >
                        {tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                size="small"
                                sx={{
                                    height: 24,
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    bgcolor: 'rgba(26, 26, 26, 0.05)',
                                }}
                            />
                        ))}
                    </Box>
                )}

                {/* Media preview */}
                {hasMedia && !expanded && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: 'rgba(26, 26, 26, 0.03)',
                            border: '2px dashed rgba(26, 26, 26, 0.1)',
                        }}
                        onClick={() => setExpanded(true)}
                    >
                        {photos.slice(0, isMobile ? 3 : 4).map((photo) => (
                            <Box
                                key={photo.id}
                                component="img"
                                src={photo.thumbnail_url || photo.url}
                                alt=""
                                sx={{
                                    width: { xs: 48, sm: 56 },
                                    height: { xs: 48, sm: 56 },
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                }}
                            />
                        ))}

                        {(photos.length > (isMobile ? 3 : 4) || videos.length > 0) && (
                            <Box
                                sx={{
                                    width: { xs: 48, sm: 56 },
                                    height: { xs: 48, sm: 56 },
                                    borderRadius: 2,
                                    bgcolor: '#1A1A1A',
                                    color: '#F5B82E',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 800, lineHeight: 1 }}>
                                    +{photos.length - (isMobile ? 3 : 4) + videos.length}
                                </Typography>
                            </Box>
                        )}

                        {photos.length === 0 && videos.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VideoIcon fontSize="small" />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {videos.length} vidéo{videos.length > 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Expanded media gallery */}
                <Collapse in={expanded}>
                    {photos.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1.5, display: 'block' }}>
                                📷 {photos.length} photo{photos.length > 1 ? 's' : ''}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' },
                                    gap: 1,
                                }}
                            >
                                {photos.slice(0, isMobile ? 6 : 8).map((photo) => (
                                    <Box
                                        key={photo.id}
                                        component="img"
                                        src={photo.thumbnail_url || photo.url}
                                        alt={photo.caption || 'Photo'}
                                        sx={{
                                            width: '100%',
                                            aspectRatio: '1',
                                            objectFit: 'cover',
                                            borderRadius: 2,
                                        }}
                                    />
                                ))}
                            </Box>
                            {photos.length > (isMobile ? 6 : 8) && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
                                    + {photos.length - (isMobile ? 6 : 8)} autres
                                </Typography>
                            )}
                        </Box>
                    )}

                    {videos.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 1.5, display: 'block' }}>
                                🎬 {videos.length} vidéo{videos.length > 1 ? 's' : ''}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                                {videos.map((video) => (
                                    <Box
                                        key={video.id}
                                        sx={{
                                            width: { xs: 120, sm: 160 },
                                            height: { xs: 68, sm: 90 },
                                            flexShrink: 0,
                                            bgcolor: '#1A1A1A',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <VideoIcon sx={{ fontSize: 28, color: '#F5B82E' }} />
                                        {video.duration_seconds && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 6,
                                                    right: 6,
                                                    bgcolor: '#F5B82E',
                                                    color: '#1A1A1A',
                                                    px: 0.75,
                                                    py: 0.25,
                                                    borderRadius: 1,
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {Math.floor(video.duration_seconds / 60)}:
                                                {String(video.duration_seconds % 60).padStart(2, '0')}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Collapse>
            </CardContent>
        </Card>
    );
}

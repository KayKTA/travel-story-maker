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
    Photo as PhotoIcon,
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

    return (
        <Card
            sx={{
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: { xs: 1, sm: 3 } },
                borderRadius: { xs: 2, sm: 2 },
            }}
        >
            <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                {/* Header - Stacked on mobile */}
                <Box sx={{ mb: 1.5 }}>
                    {/* Date & Location row */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography
                                variant={isMobile ? 'subtitle1' : 'h6'}
                                sx={{ fontWeight: 600 }}
                            >
                                {formatDateLong(entry.entry_date)}
                            </Typography>

                            {entry.location && (
                                <Chip
                                    icon={<LocationIcon sx={{ fontSize: 14 }} />}
                                    label={entry.location}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 24 }}
                                />
                            )}
                        </Box>

                        {/* Mood & Expand */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {moodData && (
                                <Chip
                                    label={isMobile ? moodData.emoji : `${moodData.emoji} ${moodData.label}`}
                                    size="small"
                                    sx={{
                                        fontWeight: 500,
                                        bgcolor: `${moodData.color}15`,
                                        height: 24,
                                    }}
                                />
                            )}

                            {isTranscribed && !isMobile && (
                                <Chip
                                    icon={<MicIcon sx={{ fontSize: 14 }} />}
                                    label="Transcrit"
                                    size="small"
                                    variant="outlined"
                                    color="info"
                                    sx={{ height: 24 }}
                                />
                            )}

                            {hasMedia && (
                                <IconButton
                                    onClick={() => setExpanded(!expanded)}
                                    size="small"
                                    sx={{
                                        transform: expanded ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.2s',
                                        ml: 0.5,
                                    }}
                                >
                                    <ExpandMoreIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {/* Trip badge if shown from global journal page */}
                    {entry.trip && (
                        <Chip
                            label={entry.trip.country}
                            size="small"
                            variant="filled"
                            sx={{ mt: 1, height: 22, fontSize: '0.7rem' }}
                        />
                    )}
                </Box>

                {/* Content - truncated on mobile if media exists */}
                <Typography
                    variant="body2"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        mb: 1.5,
                        color: 'text.primary',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        ...(isMobile && hasMedia && !expanded && {
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }),
                    }}
                >
                    {entry.content}
                </Typography>

                {/* Tags - horizontal scroll on mobile */}
                {tags.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 0.5,
                            flexWrap: { xs: 'nowrap', sm: 'wrap' },
                            overflowX: { xs: 'auto', sm: 'visible' },
                            pb: { xs: 0.5, sm: 0 },
                            mb: 1.5,
                            '&::-webkit-scrollbar': { display: 'none' },
                        }}
                    >
                        {tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.7rem',
                                    height: 22,
                                    flexShrink: 0,
                                }}
                            />
                        ))}
                    </Box>
                )}

                {/* Media preview - inline thumbnails */}
                {hasMedia && !expanded && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                        }}
                        onClick={() => setExpanded(true)}
                    >
                        {/* Show first 3 photo thumbnails */}
                        {photos.slice(0, 3).map((photo) => (
                            <Box
                                key={photo.id}
                                component="img"
                                src={photo.thumbnail_url || photo.url}
                                alt=""
                                sx={{
                                    width: 48,
                                    height: 48,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                }}
                            />
                        ))}

                        {/* Count badge */}
                        {(photos.length > 3 || videos.length > 0) && (
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 1,
                                    bgcolor: 'grey.100',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 600, lineHeight: 1 }}>
                                    +{photos.length - 3 + videos.length}
                                </Typography>
                            </Box>
                        )}

                        {photos.length === 0 && videos.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VideoIcon fontSize="small" color="action" />
                                <Typography variant="caption" color="text.secondary">
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
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {photos.length} photo{photos.length > 1 ? 's' : ''}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' },
                                    gap: 0.5,
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
                                            borderRadius: 1,
                                        }}
                                    />
                                ))}
                            </Box>
                            {photos.length > (isMobile ? 6 : 8) && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                    + {photos.length - (isMobile ? 6 : 8)} autres
                                </Typography>
                            )}
                        </Box>
                    )}

                    {videos.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                {videos.length} vidéo{videos.length > 1 ? 's' : ''}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                                {videos.map((video) => (
                                    <Box
                                        key={video.id}
                                        sx={{
                                            width: { xs: 120, sm: 160 },
                                            height: { xs: 68, sm: 90 },
                                            flexShrink: 0,
                                            bgcolor: 'grey.800',
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <VideoIcon sx={{ fontSize: 28, color: 'grey.400' }} />
                                        {video.duration_seconds && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 4,
                                                    right: 4,
                                                    bgcolor: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    px: 0.5,
                                                    borderRadius: 0.5,
                                                    fontSize: '0.65rem',
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

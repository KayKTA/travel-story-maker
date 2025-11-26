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
    ImageList,
    ImageListItem,
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
                '&:hover': { boxShadow: 3 },
            }}
        >
            <CardContent>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {formatDateLong(entry.entry_date)}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            {entry.location && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {entry.location}
                                    </Typography>
                                </Box>
                            )}

                            {entry.trip && (
                                <Chip
                                    label={entry.trip.country}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        {moodData && (
                            <Chip
                                label={`${moodData.emoji} ${moodData.label}`}
                                size="small"
                                sx={{ fontWeight: 500 }}
                            />
                        )}

                        {isTranscribed && (
                            <Chip
                                icon={<MicIcon />}
                                label="Transcrit"
                                size="small"
                                variant="outlined"
                                color="info"
                            />
                        )}

                        {hasMedia && (
                            <IconButton
                                onClick={() => setExpanded(!expanded)}
                                sx={{
                                    transform: expanded ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s',
                                }}
                            >
                                <ExpandMoreIcon />
                            </IconButton>
                        )}
                    </Stack>
                </Box>

                {/* Content */}
                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: 'pre-wrap',
                        mb: 2,
                        color: 'text.primary',
                        lineHeight: 1.7,
                    }}
                >
                    {entry.content}
                </Typography>

                {/* Tags */}
                {tags.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                        {tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={`#${tag}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                            />
                        ))}
                    </Stack>
                )}

                {/* Media indicators */}
                {hasMedia && !expanded && (
                    <Stack direction="row" spacing={2}>
                        {photos.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhotoIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {photos.length} photo{photos.length > 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        )}
                        {videos.length > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VideoIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {videos.length} vidéo{videos.length > 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                )}

                {/* Expanded media gallery */}
                <Collapse in={expanded}>
                    {photos.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Photos ({photos.length})
                            </Typography>
                            <ImageList cols={4} gap={8}>
                                {photos.slice(0, 8).map((photo) => (
                                    <ImageListItem key={photo.id}>
                                        <Box
                                            component="img"
                                            src={photo.thumbnail_url || photo.url}
                                            alt={photo.caption || 'Photo'}
                                            sx={{
                                                width: '100%',
                                                height: 120,
                                                objectFit: 'cover',
                                                borderRadius: 1,
                                            }}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                            {photos.length > 8 && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    + {photos.length - 8} autres photos
                                </Typography>
                            )}
                        </Box>
                    )}

                    {videos.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Vidéos ({videos.length})
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {videos.map((video) => (
                                    <Box
                                        key={video.id}
                                        sx={{
                                            width: 160,
                                            height: 90,
                                            bgcolor: 'grey.200',
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <VideoIcon sx={{ fontSize: 32, color: 'grey.500' }} />
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

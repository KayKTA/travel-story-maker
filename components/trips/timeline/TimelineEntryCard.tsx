'use client';

import { Box, Typography, Chip, Avatar, Stack } from '@mui/material';
import {
    LocationOn as LocationIcon,
    PhotoCamera as PhotoIcon,
    NavigateNext as ArrowIcon,
} from '@mui/icons-material';
import { formatDate } from '@/lib/utils/formatters';
import { JOURNAL_MOODS } from '@/types/journal';
import { tokens, textTruncate, flexBetween } from '@/styles';
import { TimelineDot } from '@/components/common';
import type { JournalEntryWithMedia } from '@/types';

interface TimelineEntryCardProps {
    entry: JournalEntryWithMedia;
    index: number;
    isSelected?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    onClick?: () => void;
}

export default function TimelineEntryCard({
    entry,
    index,
    isSelected = false,
    isFirst = false,
    isLast = false,
    onClick,
}: TimelineEntryCardProps) {
    const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
    const photos = entry.media_assets?.filter((m) => m.media_type === 'photo') || [];

    // Determine color based on position or mood
    const getDotColor = () => {
        if (isFirst) return '#10B981'; // Green for start
        if (isLast) return '#6366F1'; // Purple for end
        return moodData?.color || '#6B7280';
    };

    // Status chip config
    const getStatusChip = () => {
        if (isFirst) return { label: 'DÉPART', color: '#10B981', bg: '#D1FAE5' };
        if (isLast) return { label: 'ARRIVÉE', color: '#6366F1', bg: '#E0E7FF' };
        if (moodData) return { label: moodData.label.toUpperCase(), color: moodData.color, bg: `${moodData.color}15` };
        return { label: 'ÉTAPE', color: '#6B7280', bg: '#F3F4F6' };
    };

    const status = getStatusChip();
    const dotColor = getDotColor();

    return (
        <Box
            onClick={onClick}
            sx={{
                display: 'flex',
                gap: 2,
                px: 2.5,
                py: 2,
                cursor: 'pointer',
                bgcolor: isSelected ? 'action.selected' : 'transparent',
                borderLeft: 3,
                borderColor: isSelected ? 'primary.main' : 'transparent',
                transition: tokens.transitions.fast,
                '&:hover': {
                    bgcolor: isSelected ? 'action.selected' : 'action.hover',
                },
            }}
        >
            {/* Timeline dot column */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: 0.5,
                }}
            >
                {/* The dot */}
                <TimelineDot
                    index={index}
                    color={dotColor}
                    isSelected={isSelected}
                    size={isSelected ? 'lg' : 'md'}
                />

                {/* Connector line */}
                {!isLast && (
                    <Box
                        sx={{
                            flex: 1,
                            width: 2,
                            bgcolor: 'divider',
                            mt: 1,
                            minHeight: 40,
                        }}
                    />
                )}
            </Box>

            {/* Content column */}
            <Box sx={{ flex: 1, minWidth: 0, pb: 1 }}>
                {/* Header row: Location + Status */}
                <Box sx={{ ...flexBetween, mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: tokens.fontWeights.bold,
                                ...textTruncate(1),
                            }}
                        >
                            {entry.location || `Étape ${index}`}
                        </Typography>
                    </Box>

                    <Chip
                        label={status.label}
                        size="small"
                        sx={{
                            height: 20,
                            fontSize: '0.6rem',
                            fontWeight: tokens.fontWeights.bold,
                            letterSpacing: '0.5px',
                            bgcolor: status.bg,
                            color: status.color,
                            border: 'none',
                            flexShrink: 0,
                        }}
                    />
                </Box>

                {/* Date */}
                <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                >
                    {formatDate(entry.entry_date, 'EEEE dd MMMM yyyy')}
                </Typography>

                {/* Content preview (always visible) */}
                {entry.content && !isSelected && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.secondary',
                            ...textTruncate(2),
                            fontSize: '0.8rem',
                            lineHeight: 1.5,
                        }}
                    >
                        {entry.content}
                    </Typography>
                )}

                {/* Expanded details when selected */}
                {isSelected && (
                    <Box sx={{ mt: 1.5 }}>
                        {/* Stats row */}
                        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                            {moodData && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Humeur
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                        <Typography sx={{ fontSize: 16 }}>{moodData.emoji}</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.medium, fontSize: '0.8rem' }}>
                                            {moodData.label}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            {photos.length > 0 && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Photos
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                                        <PhotoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.semibold, fontSize: '0.8rem' }}>
                                            {photos.length}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            {entry.lat && entry.lng && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        GPS
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: tokens.fontWeights.medium, mt: 0.25, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                                        {entry.lat.toFixed(3)}, {entry.lng.toFixed(3)}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>

                        {/* Content */}
                        {entry.content && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Notes
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.primary',
                                        lineHeight: 1.6,
                                        fontSize: '0.8rem',
                                        ...textTruncate(4),
                                    }}
                                >
                                    {entry.content}
                                </Typography>
                            </Box>
                        )}

                        {/* Photo thumbnails */}
                        {photos.length > 0 && (
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Galerie
                                </Typography>
                                <Stack direction="row" spacing={0.75}>
                                    {photos.slice(0, 4).map((photo) => (
                                        <Avatar
                                            key={photo.id}
                                            src={photo.thumbnail_url || photo.url}
                                            variant="rounded"
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                border: 2,
                                                borderColor: 'background.paper',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                    ))}
                                    {photos.length > 4 && (
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                bgcolor: 'text.primary',
                                                color: 'background.paper',
                                                fontWeight: tokens.fontWeights.bold,
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            +{photos.length - 4}
                                        </Avatar>
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

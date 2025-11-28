'use client';

import { Box, Card, Typography } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import { formatDateLong } from '@/lib/utils/formatters';
import { JOURNAL_MOODS } from '@/types/journal';
import { tokens, textTruncate } from '@/styles';
import { PhotoThumbnailList } from '@/components/common';
import type { JournalEntryWithMedia } from '@/types';

interface TimelineEntryCardProps {
    entry: JournalEntryWithMedia;
    isSelected?: boolean;
    onClick?: () => void;
}

export default function TimelineEntryCard({
    entry,
    isSelected = false,
    onClick,
}: TimelineEntryCardProps) {
    const moodData = JOURNAL_MOODS.find((m) => m.value === entry.mood);
    const photos = entry.media_assets?.filter((m) => m.media_type === 'photo') || [];

    return (
        <Card
            onClick={onClick}
            sx={{
                p: 2,
                cursor: onClick ? 'pointer' : 'default',
                transition: tokens.transitions.fast,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                bgcolor: isSelected ? 'action.selected' : 'background.paper',
                '&:hover': {
                    bgcolor: 'action.hover',
                    borderColor: isSelected ? 'primary.main' : 'divider',
                },
            }}
        >
            {/* Date & Mood */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontWeight: tokens.fontWeights.semibold,
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}
                >
                    {formatDateLong(entry.entry_date)}
                </Typography>
                {moodData && (
                    <Typography sx={{ fontSize: 16 }}>{moodData.emoji}</Typography>
                )}
            </Box>

            {/* Location */}
            {entry.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: tokens.fontWeights.semibold }}
                    >
                        {entry.location}
                    </Typography>
                </Box>
            )}

            {/* Content preview */}
            {entry.content && (
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        ...textTruncate(2),
                        lineHeight: 1.5,
                    }}
                >
                    {entry.content}
                </Typography>
            )}

            {/* Photo thumbnails */}
            {photos.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                    <PhotoThumbnailList photos={photos} maxVisible={4} size="sm" />
                </Box>
            )}
        </Card>
    );
}

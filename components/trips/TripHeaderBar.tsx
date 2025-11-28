'use client';

import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import {
    ArrowBack as BackIcon,
    CalendarToday as CalendarIcon,
    PhotoCamera as PhotoIcon,
    Videocam as VideoIcon,
    Book as JournalIcon,
    Receipt as ExpenseIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { formatDateRange } from '@/lib/utils/formatters';
import { useBreakpoint } from '@/lib/hooks';
import { tokens, flexBetween } from '@/styles';
import type { Trip } from '@/types';

interface TripHeaderBarProps {
    trip: Trip;
    stats: {
        photosCount: number;
        videosCount: number;
    };
    onOpenJournal: () => void;
    onOpenExpense: () => void;
}

export default function TripHeaderBar({
    trip,
    stats,
    onOpenJournal,
    onOpenExpense,
}: TripHeaderBarProps) {
    const { isMobile } = useBreakpoint();

    return (
        <Box
            sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                pt: { xs: 2, sm: 3 },
                pb: { xs: 3, sm: 4 },
                px: { xs: 3, sm: 4 },
                position: 'sticky',
                top: 0,
                zIndex: tokens.zIndex.header,
            }}
        >
            {/* Top row: back + actions */}
            <Box sx={{ ...flexBetween, mb: 2 }}>
                <IconButton
                    component={Link}
                    href="/trips"
                    size="small"
                    sx={{
                        ml: -1,
                        color: 'primary.contrastText',
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.15)',
                        },
                    }}
                >
                    <BackIcon />
                </IconButton>

                {/* Desktop actions */}
                <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                    <Chip
                        icon={<JournalIcon sx={{ color: 'inherit !important' }} />}
                        label="Nouvelle étape"
                        onClick={onOpenJournal}
                        sx={{
                            bgcolor: 'primary.contrastText',
                            color: 'primary.main',
                            fontWeight: tokens.fontWeights.medium,
                            '&:hover': {
                                bgcolor: 'background.paper',
                            },
                        }}
                    />
                    <Chip
                        icon={<ExpenseIcon sx={{ color: 'inherit !important' }} />}
                        label="Dépense"
                        onClick={onOpenExpense}
                        variant="outlined"
                        sx={{
                            borderColor: 'primary.contrastText',
                            color: 'primary.contrastText',
                            fontWeight: tokens.fontWeights.medium,
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.1)',
                            },
                        }}
                    />
                </Stack>
            </Box>

            {/* Title */}
            <Typography
                variant={isMobile ? 'h4' : 'h3'}
                sx={{
                    fontWeight: tokens.fontWeights.bold,
                    lineHeight: 1.2,
                    color: 'primary.contrastText',
                }}
            >
                {trip.country}
            </Typography>
            {trip.city && (
                <Typography
                    variant={isMobile ? 'body1' : 'h6'}
                    sx={{
                        color: 'primary.contrastText',
                        opacity: 0.8,
                        fontWeight: tokens.fontWeights.regular,
                        mt: 0.5,
                    }}
                >
                    {trip.city}
                </Typography>
            )}

            {/* Stats row */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 2,
                    flexWrap: 'wrap',
                }}
            >
                <Chip
                    icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                    label={formatDateRange(trip.start_date, trip.end_date)}
                    size="small"
                    sx={{
                        bgcolor: 'rgba(0,0,0,0.15)',
                        color: 'primary.contrastText',
                        fontWeight: tokens.fontWeights.medium,
                        '& .MuiChip-icon': { color: 'inherit' },
                    }}
                />
                {stats.photosCount > 0 && (
                    <Chip
                        icon={<PhotoIcon sx={{ fontSize: 16 }} />}
                        label={stats.photosCount.toString()}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(0,0,0,0.1)',
                            color: 'primary.contrastText',
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                )}
                {stats.videosCount > 0 && (
                    <Chip
                        icon={<VideoIcon sx={{ fontSize: 16 }} />}
                        label={stats.videosCount.toString()}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(0,0,0,0.1)',
                            color: 'primary.contrastText',
                            '& .MuiChip-icon': { color: 'inherit' },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}

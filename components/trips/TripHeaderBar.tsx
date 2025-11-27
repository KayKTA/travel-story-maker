'use client';

import {
    Box,
    Chip,
    IconButton,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                bgcolor: '#1A1A1A',
                color: '#F5B82E',
                pt: { xs: 1, sm: 2 },
                pb: { xs: 2, sm: 3 },
                px: { xs: 2, sm: 3 },
                position: 'sticky',
                top: 0,
                zIndex: 10,
            }}
        >
            {/* Top row: back + actions */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                }}
            >
                <IconButton
                    component={Link}
                    href="/trips"
                    size="small"
                    sx={{
                        ml: -1,
                        color: '#F5B82E',
                        bgcolor: 'rgba(245, 184, 46, 0.1)',
                        '&:hover': { bgcolor: 'rgba(245, 184, 46, 0.2)' },
                    }}
                >
                    <BackIcon />
                </IconButton>

                {/* Desktop actions */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                    <Chip
                        icon={<JournalIcon sx={{ color: '#1A1A1A !important' }} />}
                        label="Nouvelle étape"
                        onClick={onOpenJournal}
                        sx={{
                            bgcolor: '#F5B82E',
                            color: '#1A1A1A',
                            fontWeight: 700,
                            '&:hover': { bgcolor: '#FFD466' },
                        }}
                    />
                    <Chip
                        icon={<ExpenseIcon sx={{ color: 'white !important' }} />}
                        label="Dépense"
                        onClick={onOpenExpense}
                        sx={{
                            bgcolor: '#D64545',
                            color: 'white',
                            fontWeight: 700,
                            '&:hover': { bgcolor: '#E86B6B' },
                        }}
                    />
                </Stack>
            </Box>

            {/* Title */}
            <Typography
                variant={isMobile ? 'h5' : 'h4'}
                sx={{ fontWeight: 800, lineHeight: 1.2, color: '#F5B82E' }}
            >
                {trip.country}
            </Typography>
            {trip.city && (
                <Typography
                    variant={isMobile ? 'body1' : 'h6'}
                    sx={{ color: 'rgba(245, 184, 46, 0.7)', fontWeight: 500 }}
                >
                    {trip.city}
                </Typography>
            )}

            {/* Stats chips */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    mt: 1.5,
                    flexWrap: 'wrap',
                    '& .MuiChip-root': {
                        height: 28,
                        '& .MuiChip-label': { px: 1, fontSize: '0.8rem' },
                        '& .MuiChip-icon': { fontSize: 16 },
                    },
                }}
            >
                <Chip
                    icon={<CalendarIcon />}
                    label={formatDateRange(trip.start_date, trip.end_date)}
                    size="small"
                    sx={{
                        bgcolor: '#F5B82E',
                        color: '#1A1A1A',
                        fontWeight: 700,
                        '& .MuiChip-icon': { color: '#1A1A1A' },
                    }}
                />
                {stats.photosCount > 0 && (
                    <Chip
                        icon={<PhotoIcon />}
                        label={stats.photosCount}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(245, 184, 46, 0.2)',
                            color: '#F5B82E',
                            fontWeight: 700,
                            '& .MuiChip-icon': { color: '#F5B82E' },
                        }}
                    />
                )}
                {stats.videosCount > 0 && (
                    <Chip
                        icon={<VideoIcon />}
                        label={stats.videosCount}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(245, 184, 46, 0.2)',
                            color: '#F5B82E',
                            fontWeight: 700,
                            '& .MuiChip-icon': { color: '#F5B82E' },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}

'use client';

import { alpha } from '@mui/material/styles';
import {
    Card,
    CardContent,
    CardActionArea,
    Box,
    Typography,
    Chip,
    Stack,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    Photo as PhotoIcon,
    Videocam as VideoIcon,
    Euro as EuroIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { formatDateRange, formatCurrency } from '@/lib/utils/formatters';
import { TRIP_MOODS } from '@/types/trip';
import { tokens, textTruncate } from '@/styles';
import { StatItem } from '@/components/common';
import type { TripWithStats } from '@/types';

interface TripCardProps {
    trip: TripWithStats;
}

// Cover image height
const COVER_HEIGHT = 140;

export default function TripCard({ trip }: TripCardProps) {
    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: tokens.transitions.fast,
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                },
            }}
        >
            <CardActionArea
                component={Link}
                href={`/trips/${trip.id}`}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                }}
            >
                {/* Cover */}
                <Box
                    sx={{
                        height: COVER_HEIGHT,
                        background: trip.cover_image_url
                            ? `url(${trip.cover_image_url}) center/cover`
                            : (theme) =>
                                `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                        position: 'relative',
                    }}
                >
                    {/* Overlay with title */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 'auto 0 0 0',
                            p: 2,
                            background: (theme) =>
                                `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.7)}, transparent)`,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'common.white',
                                fontWeight: tokens.fontWeights.bold,
                            }}
                        >
                            {trip.country}
                        </Typography>
                        {trip.city && (
                            <Typography
                                variant="body2"
                                sx={{ color: 'common.white', opacity: 0.85 }}
                            >
                                {trip.city}
                            </Typography>
                        )}
                    </Box>

                    {/* Mood Badge */}
                    {moodData && (
                        <Chip
                            label={`${moodData.emoji} ${moodData.label}`}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                bgcolor: 'background.paper',
                                fontWeight: tokens.fontWeights.medium,
                            }}
                        />
                    )}
                </Box>

                {/* Content */}
                <CardContent sx={{ flex: 1 }}>
                    {/* Date row */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                            {formatDateRange(trip.start_date, trip.end_date)}
                        </Typography>
                        <Chip
                            label={`${trip.duration_days} jours`}
                            size="small"
                            variant="outlined"
                            sx={{ ml: 'auto' }}
                        />
                    </Box>

                    {/* Stats */}
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        {trip.photos_count > 0 && (
                            <StatItem
                                icon={<PhotoIcon fontSize="small" />}
                                value={trip.photos_count}
                            />
                        )}
                        {trip.videos_count > 0 && (
                            <StatItem
                                icon={<VideoIcon fontSize="small" />}
                                value={trip.videos_count}
                            />
                        )}
                        {trip.total_expenses > 0 && (
                            <StatItem
                                icon={<EuroIcon fontSize="small" />}
                                value={formatCurrency(trip.total_expenses)}
                            />
                        )}
                    </Stack>

                    {/* Description preview */}
                    {trip.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 2,
                                ...textTruncate(2),
                            }}
                        >
                            {trip.description}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

'use client';

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
import type { TripWithStats } from '@/types';

interface TripCardProps {
    trip: TripWithStats;
}

export default function TripCard({ trip }: TripCardProps) {
    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
            }}
        >
            <CardActionArea
                component={Link}
                href={`/trips/${trip.id}`}
                sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
                {/* Cover Image or Gradient */}
                <Box
                    sx={{
                        height: 140,
                        background: trip.cover_image_url
                            ? `url(${trip.cover_image_url}) center/cover`
                            : 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
                        position: 'relative',
                    }}
                >
                    {/* Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{ color: 'white', fontWeight: 700 }}
                        >
                            {trip.country}
                        </Typography>
                        {trip.city && (
                            <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255,255,255,0.85)' }}
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
                                bgcolor: 'rgba(255,255,255,0.95)',
                                fontWeight: 500,
                            }}
                        />
                    )}
                </Box>

                {/* Content */}
                <CardContent sx={{ flex: 1 }}>
                    {/* Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhotoIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {trip.photos_count}
                                </Typography>
                            </Box>
                        )}
                        {trip.videos_count > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <VideoIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {trip.videos_count}
                                </Typography>
                            </Box>
                        )}
                        {trip.total_expenses > 0 && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EuroIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {formatCurrency(trip.total_expenses)}
                                </Typography>
                            </Box>
                        )}
                    </Stack>

                    {/* Description preview */}
                    {trip.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
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

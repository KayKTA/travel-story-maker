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
    useTheme,
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
    const theme = useTheme();
    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[2],
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
                        height: 140,
                        background: trip.cover_image_url
                            ? `url(${trip.cover_image_url}) center/cover`
                            : (theme) =>
                                  `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
                        position: 'relative',
                    }}
                >
                    {/* Overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 'auto 0 0 0',
                            p: 2,
                            background: (theme) =>
                                `linear-gradient(to top, ${alpha(
                                    theme.palette.common.black,
                                    0.7,
                                )}, transparent)`,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'common.white',
                                fontWeight: 700,
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
                                fontWeight: 500,
                            }}
                        />
                    )}
                </Box>

                {/* Content */}
                <CardContent sx={{ flex: 1 }}>
                    {/* Date */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
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
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                <PhotoIcon fontSize="small" color="action" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {trip.photos_count}
                                </Typography>
                            </Box>
                        )}
                        {trip.videos_count > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                <VideoIcon fontSize="small" color="action" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {trip.videos_count}
                                </Typography>
                            </Box>
                        )}
                        {trip.total_expenses > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                }}
                            >
                                <EuroIcon fontSize="small" color="action" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
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

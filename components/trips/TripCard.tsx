'use client';

import { alpha } from '@mui/material/styles';
import {
    Card,
    CardActionArea,
    Box,
    Typography,
    Chip,
    Stack,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    Photo as PhotoIcon,
    Euro as EuroIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatters';
import { TRIP_MOODS } from '@/types/trip';
import { tokens, textTruncate, theme } from '@/styles';
import type { TripWithStats } from '@/types';

interface TripCardProps {
    trip: TripWithStats;
}

const CARD_HEIGHT = 460;

export default function TripCard({ trip }: TripCardProps) {
    const moodData = TRIP_MOODS.find((m) => m.value === trip.mood);

    const startDate = trip.start_date ? new Date(trip.start_date) : null;
    const monthLabel = startDate
        ? startDate
            .toLocaleString('fr-FR', { month: 'short' })
            .toUpperCase()
        : '';
    const dayLabel = startDate ? startDate.getDate() : '';

    return (
        <Card
            sx={(theme) => ({
                // borderRadius: 4,
                boxShadow: theme.shadows[3],
                overflow: 'hidden',
                backgroundColor: 'transparent',
                transition: theme.transitions.create(['transform', 'box-shadow'], {
                    duration: theme.transitions.duration.shorter,
                }),
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                },
            })}
        >
            <CardActionArea
                component={Link}
                href={`/trips/${trip.id}`}
                sx={{ display: 'block' }}
            >
                <Box
                    sx={(theme) => ({
                        position: 'relative',
                        height: CARD_HEIGHT,
                        display: 'flex',
                        alignItems: 'stretch',
                        justifyContent: 'flex-end',
                        backgroundImage: trip.cover_image_url
                            ? `url(${trip.cover_image_url})`
                            : `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'bottom',
                    })}
                >
                    {/* Gradient overlay */}
                    <Box
                        sx={(theme) => ({
                            position: 'absolute',
                            inset: 0,
                            background: `linear-gradient(to top, ${alpha(
                                theme.palette.common.black,
                                0.9
                            )}, ${alpha(theme.palette.common.black, 0.0)})`,
                        })}
                    />

                    {/* Content */}
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            p: 2.5,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        {/* Country name + City */}
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h3"
                                sx={{
                                    color: 'common.white',
                                    fontWeight: tokens.fontWeights.bold,
                                    lineHeight: 1.15,
                                }}
                            >
                                {trip.country}
                            </Typography>
                            {/* {trip.city && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'common.white',
                                        opacity: 0.9,
                                        mt: 0.25,
                                    }}
                                >
                                    {trip.city}
                                </Typography>
                            )} */}
                        </Box>

                        {/* Bottom info box */}
                        <Box
                            sx={(theme) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                borderRadius: 2,
                                padding: 1.25,
                                backgroundColor: alpha(
                                    theme.palette.background.default,
                                    0.7
                                ),
                                backdropFilter: 'blur(6px)',
                            })}
                        >
                            {/* Block type “DEC / 12” */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: 54,
                                }}
                            >
                                {/* Month - colored bg */}
                                <Box
                                    sx={(theme) => ({
                                        width: '100%',
                                        borderRadius: '8px 8px 0 0',
                                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                                        color: theme.palette.primary.contrastText,
                                        textAlign: 'center',
                                    })}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 700,
                                            letterSpacing: 0.8,
                                            color: 'inherit',
                                        }}
                                    >
                                        {monthLabel}
                                    </Typography>
                                </Box>

                                {/* Day - white bg */}
                                <Box
                                    sx={(theme) => ({
                                        width: '100%',
                                        borderRadius: '0 0 8px 8px',
                                        bgcolor: theme.palette.background.paper,
                                        textAlign: 'center',
                                        py: 0.8,
                                    })}
                                >
                                    <Typography
                                        variant="subtitle1"
                                        sx={(theme) => ({
                                            fontWeight: 700,
                                            lineHeight: 1.1,
                                            color: theme.palette.text.primary,
                                        })}
                                    >
                                        {dayLabel}
                                    </Typography>
                                </Box>
                            </Box>


                            {/* Trip infos */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1}
                                    sx={{ mb: 0.5 }}
                                >
                                    <CalendarIcon
                                        fontSize="small"
                                        sx={{ color: 'text.secondary' }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.primary"
                                        sx={{ fontWeight: 500 }}
                                    >
                                        {trip.duration_days} jours
                                        {/* •{' '} */}
                                        {/* {trip.start_date && trip.end_date
                                            ? `${trip.start_date} – ${trip.end_date}`
                                            : 'Dates à définir'} */}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {trip.photos_count > 0 && (
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            alignItems="center"
                                        >
                                            <PhotoIcon fontSize="small" />
                                            <Typography variant="caption">
                                                {trip.photos_count} média
                                                {trip.photos_count > 1 ? 's' : ''}
                                            </Typography>
                                        </Stack>
                                    )}

                                    {trip.total_expenses > 0 && (
                                        <Stack
                                            direction="row"
                                            spacing={0.5}
                                            alignItems="center"
                                        >
                                            <EuroIcon fontSize="small" />
                                            <Typography variant="caption">
                                                {formatCurrency(trip.total_expenses)}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Stack>
                            </Box>
                        </Box>

                        {trip.description && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 1,
                                    color: 'common.white',
                                    opacity: 0.9,
                                    ...textTruncate(2),
                                }}
                            >
                                {trip.description}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardActionArea>
        </Card>
    );
}

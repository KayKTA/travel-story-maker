'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Grid,
    Skeleton,
    Typography,
    Button,
    Stack,
    Chip,
} from '@mui/material';
import { Add as AddIcon, FlightTakeoff as FlightIcon } from '@mui/icons-material';
import TripList from './TripList';
import TripForm from './TripForm';
import { useTrips, useDisclosure } from '@/lib/hooks';
import { tokens } from '@/styles';
import Brand from '../common/Brand';

// Loading skeleton component
function TripsLoadingSkeleton() {
    return (
        <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Skeleton
                        variant="rounded"
                        height={460}
                        sx={{ borderRadius: tokens.components.card.borderRadius / 8 }}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default function TripsPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Data fetching
    const { trips, loading, createTrip, refresh } = useTrips();

    // Form modal state
    const formModal = useDisclosure();

    // Open form if ?new=true in URL
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            formModal.onOpen();
        }
    }, [searchParams, formModal]);

    // Handle form open with URL update
    const handleOpenForm = () => {
        formModal.onOpen();
        router.push('/trips?new=true', { scroll: false });
    };

    // Handle form close with URL update
    const handleCloseForm = () => {
        formModal.onClose();
        router.push('/trips', { scroll: false });
    };

    // Handle form submit
    const handleSubmit = async (data: Parameters<typeof createTrip>[0]) => {
        await createTrip(data);
    };

    // Petites stats pour le header
    const stats = useMemo(() => {
        if (!trips || trips.length === 0) {
            return {
                tripsCount: 0,
                totalDays: 0,
                totalExpenses: 0,
            };
        }

        const tripsCount = trips.length - 1;
        const totalDays = trips.reduce(
            (sum, trip) => sum + (trip.duration_days ?? 0),
            0
        );
        const totalExpenses = trips.reduce(
            (sum, trip) => sum + (trip.total_expenses ?? 0),
            0
        );

        return { tripsCount, totalDays, totalExpenses };
    }, [trips]);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* HEADER / HERO */}
            <Box
                component="header"
                sx={(theme) => ({
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                })}
            >
                <Container
                    maxWidth="lg"
                    sx={{
                        py: { xs: 3, sm: 4 },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'flex-start', md: 'center' },
                            gap: { xs: 2.5, md: 4 },
                        }}
                    >
                        {/* Titre + texte */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Brand />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                    mb: 0.5,
                                }}
                            >
                                Mes voyages
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    opacity: 0.9,
                                    maxWidth: 520,
                                }}
                            >
                                Visualisez votre tour du monde, suivez vos dépenses
                                et racontez chaque étape de vos voyages au même endroit.
                            </Typography>

                            {/* Stats */}
                            <Stack
                                direction="row"
                                spacing={1.5}
                                sx={{ mt: 2 }}
                                flexWrap="wrap"
                            >
                                <Chip
                                    label={
                                        stats.tripsCount > 0
                                            ? `${stats.tripsCount} voyage${
                                                  stats.tripsCount > 1 ? 's' : ''
                                              }`
                                            : 'Aucun voyage pour le moment'
                                    }
                                    sx={(theme) => ({
                                        bgcolor: 'primary.contrastText',
                                        color: theme.palette.primary.main,
                                        fontWeight: 600,
                                    })}
                                />
                                {stats.totalDays > 0 && (
                                    <Chip
                                        label={`${stats.totalDays} jours sur la route`}
                                        sx={{
                                            bgcolor: 'primary.dark',
                                            color: 'primary.contrastText',
                                        }}
                                    />
                                )}
                                {stats.totalExpenses > 0 && (
                                    <Chip
                                        label={`${Math.round(
                                            stats.totalExpenses
                                        )} € dépensés`}
                                        sx={{
                                            bgcolor: 'primary.dark',
                                            color: 'primary.contrastText',
                                        }}
                                    />
                                )}
                            </Stack>
                        </Box>

                        {/* Actions */}
                        {/* <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', md: 'column' },
                                alignItems: { xs: 'flex-start', md: 'flex-end' },
                                gap: 1.5,
                            }}
                        >
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<AddIcon />}
                                onClick={handleOpenForm}
                                sx={(theme) => ({
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    px: 2.5,
                                    py: 1.1,
                                    borderRadius: 999,
                                })}
                            >
                                Nouveau voyage
                            </Button>
                        </Box> */}
                    </Box>
                </Container>
            </Box>

            {/* CONTENU */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {loading ? (
                    <TripsLoadingSkeleton />
                ) : (
                    <TripList trips={trips} onRefresh={refresh} />
                )}
            </Container>

            <TripForm
                open={formModal.isOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
            />
        </Box>
    );
}

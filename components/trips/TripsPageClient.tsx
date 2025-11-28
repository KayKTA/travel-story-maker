'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Grid, Skeleton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeader } from '@/components/layout';
import TripList from './TripList';
import TripForm from './TripForm';
import { useTrips, useDisclosure } from '@/lib/hooks';
import { tokens } from '@/styles';

// Loading skeleton component
function TripsLoadingSkeleton() {
    return (
        <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Skeleton
                        variant="rounded"
                        height={280}
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

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <PageHeader
                title="Mes Voyages"
                subtitle="Gérez et explorez tous vos voyages"
                action={{
                    label: 'Nouveau voyage',
                    icon: <AddIcon />,
                    onClick: handleOpenForm,
                }}
            />

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

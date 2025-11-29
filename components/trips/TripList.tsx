'use client';

import { Grid } from '@mui/material';
import { Luggage as LuggageIcon } from '@mui/icons-material';
import TripCard from './TripCard';
import TripForm from './TripForm';
import { EmptyState } from '@/components/common';
import { useDisclosure, useTrips } from '@/lib/hooks';
import { tokens } from '@/styles';
import type { TripWithStats, TripFormData } from '@/types';

interface TripListProps {
    trips: TripWithStats[];
    onRefresh?: () => void;
}

export default function TripList({ trips, onRefresh }: TripListProps) {
    const formModal = useDisclosure();
    const { createTrip } = useTrips();

    const handleSubmit = async (data: TripFormData) => {
        await createTrip(data);
        onRefresh?.();
    };

    // Empty state
    if (trips.length === 0) {
        return (
            <>
                <EmptyState
                    icon={<LuggageIcon sx={{ fontSize: tokens.iconSizes.xl * 1.5 }} />}
                    title="Aucun voyage"
                    description="Commencez par créer votre premier voyage pour enregistrer vos aventures."
                    actionLabel="Créer un voyage"
                    onAction={formModal.onOpen}
                />

                <TripForm
                    open={formModal.isOpen}
                    onClose={formModal.onClose}
                    onSubmit={handleSubmit}
                />
            </>
        );
    }

    return (
        <Grid container spacing={3}>
            {trips.filter((trip) => trip.country !== "Multi-country" ).map((trip) => (
                <Grid key={trip.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <TripCard trip={trip} />
                </Grid>
            ))}
        </Grid>
    );
}

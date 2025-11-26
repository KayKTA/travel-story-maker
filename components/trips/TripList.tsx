'use client';

import { Grid } from '@mui/material';
import TripCard from './TripCard';
import EmptyState from '@/components/common/EmptyState';
import type { TripWithStats } from '@/types';
import { Luggage as LuggageIcon } from '@mui/icons-material';

interface TripListProps {
    trips: TripWithStats[];
}

export default function TripList({ trips }: TripListProps) {
    if (trips.length === 0) {
        return (
            <EmptyState
                icon={<LuggageIcon sx={{ fontSize: 64 }} />}
                title="Aucun voyage"
                description="Commencez par créer votre premier voyage pour enregistrer vos aventures."
                actionLabel="Créer un voyage"
                actionHref="/trips?new=true"
            />
        );
    }

    return (
        <Grid container spacing={3}>
            {trips.map((trip) => (
                <Grid key={trip.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <TripCard trip={trip} />
                </Grid>
            ))}
        </Grid>
    );
}

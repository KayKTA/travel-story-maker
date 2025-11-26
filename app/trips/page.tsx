import { Suspense } from 'react';
import { Box, Container, Skeleton, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PageHeader from '@/components/layout/PageHeader';
import TripList from '@/components/trips/TripList';
import { createClient } from '@/lib/supabase/server';
import type { TripWithStats } from '@/types';

async function getTrips(): Promise<TripWithStats[]> {
    const supabase = await createClient();

    const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching trips:', error);
        return [];
    }

    // Get stats for each trip
    const tripsWithStats = await Promise.all(
        (trips || []).map(async (trip) => {
            // Journal entries count
            const { count: journalCount } = await supabase
                .from('journal_entries')
                .select('*', { count: 'exact', head: true })
                .eq('trip_id', trip.id);

            // Media count
            const { data: mediaData } = await supabase
                .from('media_assets')
                .select('media_type')
                .eq('trip_id', trip.id);

            const photosCount = mediaData?.filter((m) => m.media_type === 'photo').length || 0;
            const videosCount = mediaData?.filter((m) => m.media_type === 'video').length || 0;

            // Expenses
            const { data: expensesData } = await supabase
                .from('expenses')
                .select('amount')
                .eq('trip_id', trip.id);

            const totalExpenses = expensesData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

            // Stories count
            const { count: storiesCount } = await supabase
                .from('stories')
                .select('*', { count: 'exact', head: true })
                .eq('trip_id', trip.id);

            // Duration
            const startDate = new Date(trip.start_date);
            const endDate = trip.end_date ? new Date(trip.end_date) : new Date();
            const durationDays = Math.ceil(
                (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;

            return {
                ...trip,
                journal_entries_count: journalCount || 0,
                media_count: (mediaData?.length || 0),
                photos_count: photosCount,
                videos_count: videosCount,
                total_expenses: totalExpenses,
                expenses_count: expensesData?.length || 0,
                stories_count: storiesCount || 0,
                duration_days: durationDays,
            } as TripWithStats;
        })
    );

    return tripsWithStats;
}

function TripsLoading() {
    return (
        <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Skeleton variant="rounded" height={280} sx={{ borderRadius: 4 }} />
                </Grid>
            ))}
        </Grid>
    );
}

async function TripsContent() {
    const trips = await getTrips();
    return <TripList trips={trips} />;
}

export default function TripsPage() {
    return (
        <Box>
            <PageHeader
                title="Mes Voyages"
                subtitle="Gérez et explorez tous vos voyages"
                action={{
                    label: 'Nouveau voyage',
                    icon: <AddIcon />,
                    href: '/trips?new=true',
                }}
            />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Suspense fallback={<TripsLoading />}>
                    <TripsContent />
                </Suspense>
            </Container>
        </Box>
    );
}

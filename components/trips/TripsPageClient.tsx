'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Container, Grid, Skeleton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import PageHeader from '@/components/layout/PageHeader';
import TripList from '@/components/trips/TripList';
import TripForm from '@/components/trips/TripForm';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TripWithStats, TripFormData } from '@/types';

export default function TripsPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [trips, setTrips] = useState<TripWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);

    // Ouvrir le formulaire si ?new=true dans l'URL
    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            setFormOpen(true);
        }
    }, [searchParams]);

    // Charger les voyages
    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setLoading(true);
        const supabase = getSupabaseClient();

        const { data: tripsData, error } = await supabase
            .from('trips')
            .select('*')
            .order('start_date', { ascending: false });

        if (error) {
            console.error('Error fetching trips:', error);
            setLoading(false);
            return;
        }

        // Charger les stats pour chaque voyage
        const tripsWithStats = await Promise.all(
            (tripsData || []).map(async (trip) => {
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
                    media_count: mediaData?.length || 0,
                    photos_count: photosCount,
                    videos_count: videosCount,
                    total_expenses: totalExpenses,
                    expenses_count: expensesData?.length || 0,
                    stories_count: storiesCount || 0,
                    duration_days: durationDays,
                } as TripWithStats;
            })
        );

        setTrips(tripsWithStats);
        setLoading(false);
    };

    const handleOpenForm = () => {
        setFormOpen(true);
        // Mettre à jour l'URL sans recharger la page
        router.push('/trips?new=true', { scroll: false });
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        // Retirer le paramètre de l'URL
        router.push('/trips', { scroll: false });
    };

    const handleSubmit = async (data: TripFormData) => {
        const supabase = getSupabaseClient();

        const { data: newTrip, error } = await supabase
            .from('trips')
            .insert({
                country: data.country,
                city: data.city || null,
                start_date: data.start_date,
                end_date: data.end_date || null,
                mood: data.mood || null,
                lat: data.lat || null,
                lng: data.lng || null,
                cover_image_url: data.cover_image_url || null,
                description: data.description || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating trip:', error);
            throw error;
        }

        // Recharger la liste
        await loadTrips();

        // Optionnel: rediriger vers le nouveau voyage
        // router.push(`/trips/${newTrip.id}`);
    };

    return (
        <Box>
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
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                                <Skeleton variant="rounded" height={280} sx={{ borderRadius: 4 }} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <TripList trips={trips} onRefresh={loadTrips} />
                )}
            </Container>

            {/* Formulaire de création */}
            <TripForm
                open={formOpen}
                onClose={handleCloseForm}
                onSubmit={handleSubmit}
            />
        </Box>
    );
}
